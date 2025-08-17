import { Plane } from "@react-three/drei";
import type React from "react";
import * as THREE from "three";
import { SolidArrow } from "./SolidArrow";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import Font from "./Font";

export function CoordinateSystem() {
  const selector = useSelector((data: RootState) => data);

  const max = selector.sceneConfig.maxDist;

  const origin: [number, number, number] = [0, 0, 0];
  return (
    <>
      <SolidArrow
        from={origin}
        to={[max, 0, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1}
      />
      <SolidArrow
        from={origin}
        to={[-max, 0, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1}
      />
      <SolidArrow
        from={origin}
        to={[0, max, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1}
      />
      <SolidArrow
        from={origin}
        to={[0, -max, 0]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1}
      />
      <SolidArrow
        from={origin}
        to={[0, 0, max]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1}
      />
      <SolidArrow
        from={origin}
        to={[0, 0, -max]}
        color="white"
        shaftRadius={0.05}
        headRadius={0.1}
      />
      <Plane rotation={[Math.PI / 2, 0, 0]} args={[Math.ceil(max * 2), Math.floor(max * 2)]}>
        <meshBasicMaterial color="white" transparent={true} opacity={0.2} side={THREE.DoubleSide} />
      </Plane>

      <Font text="X" pos={[max, -0.1, -0.1]} color="rgb(2,322,35)" size={0.3} opacity={1} />
      <Font text="Y" pos={[-0.1, max, 0]} color="rgb(212,25,35)" size={0.3} opacity={1} />
      <Font text="Z" pos={[0.1, -0.1, max]} color="rgb(0,0,235)" size={0.3} opacity={1} />
    </>
  );
}
