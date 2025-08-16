import { useState, useEffect } from "react";
import type { VectorType } from "../../store/VectorSlice";
import Text3D from "../Font";

export function CircleContainer({ vec }: { vec: VectorType }) {
  const { x, y, z } = vec.vector;
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    hovered
      ? (window.document.body.style.cursor = "pointer")
      : (window.document.body.style.cursor = "default");
  }, [hovered]);

  return (
    <mesh
      position={[x, y, z]}
      onClick={() => setShow((prev) => !prev)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {show && (
        <Text3D
          faceCamera={true}
          text={`<${x},${y},${z}>`}
          pos={[0.1, 0.1, 0.1]}
          color={"gold"}
          size={0.1}
          opacity={0.75}
        />
      )}
      <sphereGeometry args={[0.05]} />
      <meshPhysicalMaterial color="red" metalness={0.7} />
    </mesh>
  );
}
