import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import Text3D from "./Font";

type SolidArrowProps = {
  from?: [number, number, number];
  to?: [number, number, number];
  shaftRadius?: number;
  headLength?: number;
  headRadius?: number;
  color?: string;
  isShowable?: boolean;
};
export function SolidArrow({
  from = [0, 0, 0],
  to = [1, 0, 0],
  isShowable = false,
  shaftRadius = 0.02,
  headLength = 0.2,
  headRadius = 0.06,
  color = "red",
}: SolidArrowProps) {
  const [show, setShow] = useState(isShowable);
  const [hover, setHover] = useState(false);

  const { dir, shaftLength } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const fullDir = new THREE.Vector3().subVectors(end, start);
    const length = fullDir.length();
    return { dir: fullDir.normalize(), shaftLength: length - headLength };
  }, [from, to, headLength]);

  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); // orient along arrow direction
    return q;
  }, [dir]);

  // event side effect
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "default";
  }, [hover]);

  return (
    <group position={from} quaternion={quat}>
      {/* Shaft, centered along Y axis */}
      <mesh
        position={[0, shaftLength / 2, 0]}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => setShow((prev) => !prev)}
      >
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head, placed after shaft */}
      <mesh
        position={[0, shaftLength + headLength / 2, 0]}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => setShow((prev) => !prev)}
      >
        <coneGeometry args={[headRadius, headLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Text (relative to arrow tip) */}
      {show && (
        <Text3D
          text={`(${to[0]},${to[1]},${to[2]})`}
          pos={[0.1, shaftLength + headLength + 0.1, 0.1]} // relative offset from tip
          color="gold"
          size={0.2}
          opacity={0.75}
          faceCamera
        />
      )}
    </group>
  );
}
