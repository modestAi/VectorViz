import { Plane } from "@react-three/drei";
import type React from "react";
import * as THREE from "three";
import { SolidArrow } from "./SolidArrow";

export function CoordinateSystem(props: { max: number; }) {
  const { max } = props;

  const origin: [number, number, number] = [0, 0, 0];
  return (
    <>
      <SolidArrow
        from={origin}
        to={[max, 0, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1} />
      <SolidArrow
        from={origin}
        to={[-max, 0, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1} />
      <SolidArrow
        from={origin}
        to={[0, max, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1} />
      <SolidArrow
        from={origin}
        to={[0, -max, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1} />
      <SolidArrow
        from={origin}
        to={[0, 0, max]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1} />
      <SolidArrow
        from={origin}
        to={[0, 0, -max]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1} />
      <Plane rotation={[Math.PI / 2, 0, 0]} args={[Math.ceil(max * 2), Math.floor(max * 2)]}>
        <meshBasicMaterial color="white" transparent={true} opacity={0.2} side={THREE.DoubleSide} />
      </Plane>
    </>
  );
}
