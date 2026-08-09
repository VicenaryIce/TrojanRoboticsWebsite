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
  controlsRef: React.RefObject<OrbitControlsImpl>;
  resetSignal: number;
  onFramed: (info: FrameInfo) => void;
}

function Model({ url, controlsRef, resetSignal, onFramed }: ModelProps) {
  const { camera } = useThree();
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);

  const frameCamera = useCallback(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    // Freshly attached scene graphs have stale/identity matrixWorld until
    // this runs, which throws off Box3.setFromObject below.
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    scene.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
    scene.updateMatrixWorld(true);

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

  return <primitive object={scene} />;
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
  resetSignal: number;
  autoRotateSpeed: number;
}

function Scene({ url, resetSignal, autoRotateSpeed }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [frame, setFrame] = useState<FrameInfo | null>(null);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <Model url={url} controlsRef={controlsRef} resetSignal={resetSignal} onFramed={setFrame} />
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
  autoRotateSpeed?: number;
  className?: string;
}

export default function ModelViewer({ url, autoRotateSpeed = 0.6, className = '' }: ModelViewerProps) {
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
        <Scene url={url} resetSignal={resetSignal} autoRotateSpeed={autoRotateSpeed} />
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
