
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

function OrbitingNode({
  label,
  rotation,
  speed,
  selected,
  onSelect
}) {
  const orbitRef = useRef();
  const sphereRef = useRef();
  const visualRef = useRef();
  const textRef = useRef();

  const worldPosition = useRef(new Vector3());
  const targetScale = useRef(new Vector3(1, 1, 1));

  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * speed;
    }

    if (sphereRef.current && textRef.current) {
      sphereRef.current.getWorldPosition(worldPosition.current);

      textRef.current.position.copy(worldPosition.current);
      textRef.current.position.y -= 0.3;

      textRef.current.quaternion.copy(state.camera.quaternion);
    }

    if (visualRef.current) {
      targetScale.current.setScalar(selected ? 1.5 : 1);

      visualRef.current.scale.lerp(
        targetScale.current,
        1 - Math.exp(-8 * delta)
      );
    }
  });

  return (
    <>
      <group rotation={rotation}>
        <group ref={orbitRef}>
          <group ref={sphereRef} position={[2, 0, 0]}>
            <mesh
              ref={visualRef}
              castShadow
              onClick={(event) => {
                event.stopPropagation();
                onSelect();
              }}
            >
              <sphereGeometry args={[0.12, 32, 32]} />

              <meshStandardMaterial
                color={selected ? "#ffffff" : "#d8d8d8"}
                roughness={0.18}
                metalness={0.75}
              />
            </mesh>
          </group>
        </group>
      </group>

      <Text
        ref={textRef}
        fontSize={selected ? 0.16 : 0.12}
        color={selected ? "#ffffff" : "#999999"}
        anchorX="center"
        anchorY="middle"
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        {label}
      </Text>
    </>
  );
}

export default OrbitingNode;
