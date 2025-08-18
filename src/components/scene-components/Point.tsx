import { useState } from "react";
import type { VectorType } from "../../store/VectorSlice";
import Text3D from "./Text3D";
import { useThree } from "@react-three/fiber";

export function Point({ vec }: { vec: VectorType }) {
  const { x, y, z } = vec.vector;
  const [show, setShow] = useState(false);

  const canvas = useThree().gl.domElement;
  return (
    <mesh
      onPointerEnter={() => canvas.classList.add("pointer")}
      onPointerLeave={() => canvas.classList.remove("pointer")}
      position={[x, y, z]}
      onClick={() => setShow((prev) => !prev)}
    >
      {show && (
        <Text3D
          faceCamera={true}
          text={`(${x},${y},${z})`}
          pos={[0.1, 0.1, 0.1]}
          color={"rgb(244,200,15)"}
          size={0.1}
          opacity={0.75}
        />
      )}
      <sphereGeometry args={[0.09]} />
      <meshPhysicalMaterial color="red" opacity={0.75} />
    </mesh>
  );
}
