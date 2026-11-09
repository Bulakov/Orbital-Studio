import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import OrbitingNode from "./OrbitingNode";
import { Object3D, Vector3 } from "three";

function CentralSphere() {
  return (
    <mesh receiveShadow>
      <sphereGeometry args={[1.5, 64, 64]} />

      <meshStandardMaterial
        color="#777777"
        roughness={0.25}
        metalness={0.15}
      />
    </mesh>
  );
}

function CentralHalo() {
  const haloRef = useRef();

  useFrame((state) => {
    if (!haloRef.current) return;

    const distance = Math.sqrt(
      state.pointer.x ** 2 + state.pointer.y ** 2
    );

    const intensity = Math.max(0, 1 - distance * 0.45);

    haloRef.current.material.opacity =
      0.08 + intensity * 0.16;
  });

  return (
    <mesh ref={haloRef}>
      <sphereGeometry args={[1.58, 64, 64]} />

      <meshBasicMaterial
        color="#bfcbd8"
        transparent
        opacity={0.12}
        side={2}
        depthWrite={false}
      />
    </mesh>
  );
}
function OrbitalSystem({ selectedSection, onSelect }) {
  return (
    <>
      <OrbitingNode
        rotation={[0, 0, 0]}
        speed={0.3}
        label="GAMES"
        selected={selectedSection === "GAMES"}
        onSelect={() => onSelect("GAMES")}
      />

      <OrbitingNode
        rotation={[0.8, 0, 0.5]}
        speed={-0.25}
        label="BOOKS"
        selected={selectedSection === "BOOKS"}
        onSelect={() => onSelect("BOOKS")}
      />

      <OrbitingNode
        rotation={[-0.8, 0, -0.5]}
        speed={0.2}
        label="MOVIES"
        selected={selectedSection === "MOVIES"}
        onSelect={() => onSelect("MOVIES")}
      />

      <OrbitingNode
        rotation={[1.2, 0, -0.8]}
        speed={-0.35}
        label="SERIES"
        selected={selectedSection === "SERIES"}
        onSelect={() => onSelect("SERIES")}
      />
    </>
  );
}

function CursorLight() {
  const lightRef = useRef();
  const target = useMemo(() => new Object3D(), []);
  const desiredPosition = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (!lightRef.current) return;

    const { pointer, camera } = state;

    desiredPosition
      .set(pointer.x, pointer.y, 0.5)
      .unproject(camera);

    desiredPosition
      .sub(camera.position)
      .normalize()
      .multiplyScalar(3.5)
      .add(camera.position);

    const smoothness = 1 - Math.exp(-8 * delta);

    lightRef.current.position.lerp(
      desiredPosition,
      smoothness
    );
  });

  return (
    <>
      <primitive object={target} />

      <spotLight
        ref={lightRef}
        target={target}
        intensity={35}
        angle={0.45}
        penumbra={0.8}
        distance={12}
        decay={2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
    </>
  );
}

export default function OrbitalScene() {
    const [selectedSection, setSelectedSection] = useState(null);
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ambientLight intensity={0.2} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={0.5}
      />

      <CursorLight />
      <CentralHalo />
      <CentralSphere />
      <OrbitalSystem
         selectedSection={selectedSection}
         onSelect={setSelectedSection}
        />
    </Canvas>
  );
}
