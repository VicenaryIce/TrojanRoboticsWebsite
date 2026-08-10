/* eslint-disable react/no-unknown-property */
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, invalidate, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import './ModelViewer.css';

interface FrameInfo {
  distance: number;
  radius: number;
}

interface ModelProps {
  url: string;
  /** Corrective rotation in degrees, for GLBs whose source up-axis doesn't land Y-up in three.js. */
  rotationCorrection: [number, number, number];
  controlsRef: React.RefObject<OrbitControlsImpl>;
  resetSignal: number;
  onFramed: (info: FrameInfo) => void;
}

// Keyed by url in <Scene>, so every instance of this component is a fresh
// mount for its robot — no state or transforms can leak in from whatever
// was previously loaded in the wrapper group.
function Model({ url, rotationCorrection, controlsRef, resetSignal, onFramed }: ModelProps) {
  const { camera } = useThree();
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);
  const wrapperRef = useRef<THREE.Group>(null);

  const frameCamera = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    // Reset any prior offset before measuring, then force a fresh
    // matrixWorld — freshly attached scene graphs have stale/identity
    // matrices until this runs, which throws off Box3.setFromObject below.
    wrapper.position.set(0, 0, 0);
    wrapper.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    if (import.meta.env.DEV) {
      const size = box.getSize(new THREE.Vector3());
      // eslint-disable-next-line no-console
      console.log(
        `[ModelViewer] ${url} bbox size (post-correction) x=${size.x.toFixed(3)} y=${size.y.toFixed(3)} z=${size.z.toFixed(3)} — the "tall" axis should be y`
      );
    }

    // Recenter by offsetting the WRAPPER, not the loaded scene itself —
    // keeps the source geometry untouched and this fully idempotent no
    // matter how many times frameCamera reruns (StrictMode double-invoke,
    // Reset View, etc.) since we always measure from a zeroed wrapper.
    wrapper.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
    wrapper.updateMatrixWorld(true);

    if (camera instanceof THREE.PerspectiveCamera) {
      const radius = Math.max(sphere.radius, 0.001);
      const distance = (radius * 2.1) / Math.sin((camera.fov * Math.PI) / 180 / 2);
      camera.position.set(distance * 0.55, distance * 0.4, distance * 0.85);
      camera.near = distance / 100;
      camera.far = distance * 30;
      camera.updateProjectionMatrix();

      const controls = controlsRef.current;
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
      onFramed({ distance, radius });
    }
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, camera]);

  useLayoutEffect(() => {
    frameCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    frameCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const [rx, ry, rz] = rotationCorrection;
  return (
    <group
      ref={wrapperRef}
      rotation={[THREE.MathUtils.degToRad(rx), THREE.MathUtils.degToRad(ry), THREE.MathUtils.degToRad(rz)]}
    >
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-viewer__loader">
        <div className="model-viewer__spinner" />
        <span>{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

interface SceneProps {
  url: string;
  rotationCorrection: [number, number, number];
  resetSignal: number;
  autoRotateSpeed: number;
}

function Scene({ url, rotationCorrection, resetSignal, autoRotateSpeed }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [frame, setFrame] = useState<FrameInfo | null>(null);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset the framing state immediately when the robot changes so the old
  // model's zoom clamps/contact-shadow scale don't flash before the new
  // one finishes loading.
  useEffect(() => {
    setFrame(null);
  }, [url]);

  useEffect(() => {
    const t = setTimeout(() => setIdle(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  };

  const handleEnd = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 2800);
  };

  const minDistance = frame ? frame.distance * 0.35 : 0.05;
  const maxDistance = frame ? frame.distance * 4 : 500;

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 2, -3]} intensity={0.45} color="#f2c230" />
      <directionalLight position={[0, 3, -6]} intensity={0.7} color="#8fb8ff" />

      <Environment preset="night" background={false} />

      <Suspense fallback={<Loader />}>
        <Model
          key={url}
          url={url}
          rotationCorrection={rotationCorrection}
          controlsRef={controlsRef}
          resetSignal={resetSignal}
          onFramed={setFrame}
        />
        {frame && (
          <ContactShadows
            position={[0, -frame.radius * 0.98, 0]}
            opacity={0.45}
            scale={frame.radius * 8}
            blur={2.2}
            far={frame.radius * 3}
          />
        )}
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={minDistance}
        maxDistance={maxDistance}
        autoRotate={idle}
        autoRotateSpeed={autoRotateSpeed}
        onStart={handleStart}
        onEnd={handleEnd}
      />
    </>
  );
}

interface ModelViewerProps {
  url: string;
  /** Corrective rotation in degrees for this specific GLB's source orientation. */
  rotationCorrection?: [number, number, number];
  autoRotateSpeed?: number;
  className?: string;
}

export default function ModelViewer({
  url,
  rotationCorrection = [0, 0, 0],
  autoRotateSpeed = 0.6,
  className = '',
}: ModelViewerProps) {
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <div className={`model-viewer ${className}`}>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ fov: 45, near: 0.01, far: 100, position: [2, 1.5, 3] }}
        style={{ touchAction: 'none' }}
      >
        <Scene
          url={url}
          rotationCorrection={rotationCorrection}
          resetSignal={resetSignal}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>

      <button
        type="button"
        className="model-viewer__reset btn"
        onClick={() => setResetSignal((n) => n + 1)}
        aria-label="Reset camera view"
      >
        Reset View
      </button>

      <div className="model-viewer__hint">Drag to rotate · Scroll / pinch to zoom</div>
    </div>
  );
}
