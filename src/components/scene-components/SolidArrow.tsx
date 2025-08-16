import React, { useMemo } from "react";
import * as THREE from "three";

type SolidArrowProps = {
  from?: [number, number, number];
  to?: [number, number, number];
  shaftRadius?: number;
  headLength?: number;
  headRadius?: number;
  color?: string;
};
export function SolidArrow({
  from = [0, 0, 0], to = [1, 0, 0], shaftRadius = 0.02, headLength = 0.2, headRadius = 0.06, color = "red",
}: SolidArrowProps) {
  const { shaftPos, headPos, dir, shaftLength } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const fullDir = new THREE.Vector3().subVectors(end, start);
    const length = fullDir.length();
    const dir = fullDir.clone().normalize();

    const shaftLength = length - headLength;
    const shaftPos = start.clone().add(dir.clone().multiplyScalar(shaftLength / 2));
    const headPos = start.clone().add(dir.clone().multiplyScalar(shaftLength + headLength / 2));

    return { shaftPos, headPos, dir, shaftLength };
  }, [from, to, headLength]);

  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); //Direction for orientation
    return q;
  }, [dir]);

  return (
    <>
      {/* Shaft */}
      <mesh position={shaftPos.toArray()} quaternion={quat}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh position={headPos.toArray()} quaternion={quat}>
        <coneGeometry args={[headRadius, headLength]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
}
