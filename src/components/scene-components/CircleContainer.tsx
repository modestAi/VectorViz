import { useState } from "react";
import type { VectorType } from "../../store/VectorSlice";
import Text3D from "./Font";

export function CircleContainer({
  vec,
  onHoverChange,
}: {
  vec: VectorType;
  onHoverChange?: (hover: boolean) => void;
}) {
  const { x, y, z } = vec.vector;
  const [show, setShow] = useState(false);

  return (
    <mesh
      onPointerOver={() => onHoverChange?.(true)}
      onPointerOut={() => onHoverChange?.(false)}
      position={[x, y, z]}
      onClick={() => setShow((prev) => !prev)}
    >
      {show && (
        <Text3D
          faceCamera={true}
          text={`(${x},${y},${z})`}
          pos={[0.1, 0.1, 0.1]}
          color={"gold"}
          size={0.1}
          opacity={0.75}
        />
      )}
      <sphereGeometry args={[0.09]} />
      <meshPhysicalMaterial color="red" opacity={0.75} />
    </mesh>
  );
}
