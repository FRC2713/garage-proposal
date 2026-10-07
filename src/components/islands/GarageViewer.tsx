import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { cn } from "@/lib/utils";

/** SketchUp model coordinates in feet (x east, y north, z up) to three.js meters. */
const ft = (x: number, y: number, z: number) =>
  new THREE.Vector3(x * 0.3048, z * 0.3048, -y * 0.3048);

const views = [
  {
    id: "overview",
    label: "Overview",
    eye: ft(420, 355, 95),
    target: ft(462, 418, 0),
  },
  {
    id: "field",
    label: "Practice field",
    eye: ft(489, 406, 13),
    target: ft(460, 438, 1),
  },
  {
    id: "mezzanine",
    label: "Mezzanine",
    eye: ft(438, 447, 17),
    target: ft(474, 420, 0),
  },
  {
    id: "cage",
    label: "Fabrication cage",
    eye: ft(449, 411, 40),
    target: ft(446, 395, 0),
  },
  {
    id: "room6",
    label: "Room 6",
    eye: ft(429, 417, 40),
    target: ft(425, 400, 0),
  },
  {
    id: "classroom",
    label: "Classroom",
    eye: ft(489, 406, 38),
    target: ft(488, 395, 0),
  },
] as const;

type ViewId = (typeof views)[number]["id"];

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  useEffect(() => {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const transparent = (o.material as THREE.Material).transparent;
        o.castShadow = !transparent;
        o.receiveShadow = true;
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

/** Glides the camera to the selected view until the visitor takes over. */
function CameraRig({
  view,
  controls,
  flying,
  onArrive,
}: {
  view: ViewId;
  controls: React.RefObject<OrbitControlsImpl | null>;
  flying: boolean;
  onArrive: () => void;
}) {
  const camera = useThree((s) => s.camera);
  const reduceMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useFrame((_, dt) => {
    const c = controls.current;
    if (!flying || !c) return;
    const v = views.find((x) => x.id === view)!;
    const k = reduceMotion.current ? 1 : 1 - Math.exp(-dt * 3.5);
    camera.position.lerp(v.eye, k);
    c.target.lerp(v.target, k);
    c.update();
    if (
      camera.position.distanceTo(v.eye) < 0.05 &&
      c.target.distanceTo(v.target) < 0.05
    ) {
      onArrive();
    }
  });
  return null;
}

/** Late-morning sun over the garage, with shadows sized to the building. */
function Sun({ target }: { target: THREE.Vector3 }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    const l = light.current;
    if (!l) return;
    l.target.position.copy(target);
    l.target.updateMatrixWorld();
  }, [target]);
  return (
    <directionalLight
      ref={light}
      castShadow
      position={target
        .clone()
        .add(new THREE.Vector3(30, 60, 25))
        .toArray()}
      intensity={2.2}
      shadow-mapSize={[4096, 4096]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
      shadow-camera-left={-45}
      shadow-camera-right={45}
      shadow-camera-top={45}
      shadow-camera-bottom={-45}
      shadow-camera-near={1}
      shadow-camera-far={200}
    />
  );
}

function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div
      role="status"
      className="absolute inset-0 grid place-items-center bg-muted/80 text-sm text-muted-foreground"
    >
      Loading the 3D model… {Math.round(progress)}%
    </div>
  );
}

export default function GarageViewer({
  modelUrl,
  fallbackImage,
}: {
  modelUrl: string;
  fallbackImage: string;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [view, setView] = useState<ViewId>("overview");
  const [flying, setFlying] = useState(true);
  const start = views[0];

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div
        role="toolbar"
        aria-label="Camera views"
        className="flex gap-2 overflow-x-auto border-b p-3"
      >
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => {
              setView(v.id);
              setFlying(true);
            }}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-1 ring-foreground/10 transition-colors",
              view === v.id
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div
        className="relative aspect-[4/3] w-full bg-[#eef0f2] sm:aspect-video"
        aria-label="Interactive 3D model of the Option B garage layout. Drag to orbit, scroll or pinch to zoom, right-drag to pan."
        role="img"
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{
            position: start.eye.toArray(),
            fov: 40,
            near: 0.3,
            far: 600,
          }}
          fallback={
            <img
              src={fallbackImage}
              alt="Rendering of the Option B garage layout"
              className="size-full object-cover"
            />
          }
        >
          <color attach="background" args={["#eef0f2"]} />
          <hemisphereLight args={["#ffffff", "#b9bcc0", 1.6]} />
          <Sun target={start.target} />
          <mesh
            rotation-x={-Math.PI / 2}
            position={[start.target.x, -0.02, start.target.z]}
            receiveShadow
          >
            <planeGeometry args={[400, 400]} />
            <meshStandardMaterial color="#d9dbde" />
          </mesh>
          <Suspense fallback={null}>
            <Model url={modelUrl} />
          </Suspense>
          <OrbitControls
            ref={controls}
            target={start.target.toArray()}
            enableDamping
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={3}
            maxDistance={120}
            onStart={() => setFlying(false)}
          />
          <CameraRig
            view={view}
            controls={controls}
            flying={flying}
            onArrive={() => setFlying(false)}
          />
        </Canvas>
        <LoadingOverlay />
      </div>
      <p className="border-t px-4 py-3 text-xs text-muted-foreground">
        Drag to orbit · scroll or pinch to zoom · right-drag or two-finger drag
        to pan. Roof removed to show the interior.
      </p>
    </div>
  );
}
