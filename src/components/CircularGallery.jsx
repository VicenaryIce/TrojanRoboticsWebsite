/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import './CircularGallery.css';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Draws `text` to an offscreen canvas and hands back the pixels as an ogl
// Texture — simpler than a bitmap font atlas and works with any system/
// web font declared via the `font` prop (e.g. "bold 30px Orbitron").
function createTextTexture(gl, text, font, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSizeMatch = font.match(/(\d+)px/);
  const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 30;
  const textHeight = Math.ceil(fontSize * 1.6);

  canvas.width = textWidth + 32;
  canvas.height = textHeight;
  // Re-set font after resize — changing canvas dimensions resets context state.
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class GalleryItem {
  constructor({ gl, scene, geometry, image, text, index, length, screen, viewport, bend, textColor, font, borderRadius }) {
    this.gl = gl;
    this.scene = scene;
    this.geometry = geometry;
    this.image = image;
    this.text = text;
    this.index = index;
    this.length = length;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.font = font;
    this.borderRadius = borderRadius;
    this.extra = 0;
    this.speed = 0;

    this.createMesh();
    this.createLabel();
    this.onResize({ screen, viewport });
  }

  createMesh() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b + vec2(r);
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uImageSizes: { value: [1, 1] },
        uPlaneSizes: { value: [1, 1] },
        uBorderRadius: { value: this.borderRadius },
      },
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    img.src = this.image;

    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  createLabel() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const program = new Program(this.gl, {
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.05) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
    });
    this.label = new Mesh(this.gl, { geometry: new Plane(this.gl), program });
    this.labelAspect = width / height;
    this.label.setParent(this.scene);
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    const labelHeight = this.plane.scale.y * 0.12;
    this.label.scale.set(labelHeight * this.labelAspect, labelHeight, 1);

    this.padding = this.plane.scale.x * 0.12;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (!this.bend) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B = Math.abs(this.bend);
      const R = (H * H + B * B) / (2 * B);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(Math.max(R * R - effectiveX * effectiveX, 0));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.label.position.x = this.plane.position.x;
    this.label.position.y = this.plane.position.y - this.plane.scale.y * 0.5 - this.label.scale.y * 0.9;
    this.label.rotation.z = this.plane.rotation.z;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
}

class CircularGalleryApp {
  constructor(container, { items, bend, textColor, borderRadius, font, scrollEase }) {
    this.container = container;
    this.items = items;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.scrollEase = scrollEase;

    this.scroll = { current: 0, target: 0, last: 0 };
    this.isDown = false;
    this.dragStartX = 0;
    this.dragStartScroll = 0;
    this.destroyed = false;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createItems();
    this.bindEvents();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
    this.gl.canvas.style.width = '100%';
    this.gl.canvas.style.height = '100%';
    this.gl.canvas.style.display = 'block';
    this.gl.canvas.style.touchAction = 'pan-y';
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 1, widthSegments: 1 });
  }

  createItems() {
    const galleryItems = this.items.length ? this.items : [];
    this.mediaItems = galleryItems.map(
      (item, index) =>
        new GalleryItem({
          gl: this.gl,
          scene: this.scene,
          geometry: this.planeGeometry,
          image: item.image,
          text: item.text,
          index,
          length: galleryItems.length,
          screen: this.screen,
          viewport: this.viewport,
          bend: this.bend,
          textColor: this.textColor,
          font: this.font,
          borderRadius: this.borderRadius,
        })
    );
  }

  bindEvents() {
    this.onWheel = (e) => {
      e.preventDefault();
      this.scroll.target += (e.deltaY || e.deltaX) * 0.4;
    };
    this.onPointerDown = (e) => {
      this.isDown = true;
      this.dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
      this.dragStartScroll = this.scroll.target;
    };
    this.onPointerMove = (e) => {
      if (!this.isDown) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = this.dragStartX - x;
      this.scroll.target = this.dragStartScroll + delta * 2.2;
    };
    this.onPointerUp = () => {
      this.isDown = false;
    };
    this.onKeyDown = (e) => {
      if (e.key === 'ArrowRight') this.scroll.target += this.itemStep();
      if (e.key === 'ArrowLeft') this.scroll.target -= this.itemStep();
    };

    // Scoped to the gallery's own container (not window) so mousewheel over
    // the gallery doesn't hijack page scroll wherever it sits on the page.
    const el = this.container;
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    el.addEventListener('touchstart', this.onPointerDown, { passive: true });
    el.addEventListener('touchmove', this.onPointerMove, { passive: true });
    el.addEventListener('touchend', this.onPointerUp);
    el.tabIndex = 0;
    el.addEventListener('keydown', this.onKeyDown);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
  }

  itemStep() {
    return this.mediaItems?.[0]?.width ?? 300;
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    if (this.mediaItems) {
      this.mediaItems.forEach((item) => item.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    if (this.destroyed) return;
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scrollEase);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.mediaItems.forEach((item) => item.update(this.scroll, direction));
    this.scroll.last = this.scroll.current;
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.raf = requestAnimationFrame(() => this.update());
  }

  destroy() {
    this.destroyed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    const el = this.container;
    el.removeEventListener('wheel', this.onWheel);
    el.removeEventListener('mousedown', this.onPointerDown);
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    el.removeEventListener('touchstart', this.onPointerDown);
    el.removeEventListener('touchmove', this.onPointerMove);
    el.removeEventListener('touchend', this.onPointerUp);
    el.removeEventListener('keydown', this.onKeyDown);
    if (this.gl?.canvas?.parentNode === el) el.removeChild(this.gl.canvas);
  }
}

export default function CircularGallery({
  items = [],
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  scrollEase = 0.06,
  font = 'bold 30px Figtree, sans-serif',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const app = new CircularGalleryApp(container, { items, bend, textColor, borderRadius, font, scrollEase });
    return () => app.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, bend, textColor, borderRadius, font, scrollEase]);

  return <div className="circular-gallery" ref={containerRef} role="region" aria-label="Photo gallery" />;
}
