import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { SolidArrow } from "./SolidArrow";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import Font from "./Font";
import type { CoordTuple } from "../../utils/Types";

export function CoordinateSystem() {
  const max = useSelector((data: RootState) => data.sceneConfig.maxDist);

  const arr: CoordTuple[] = [
    [max, 0, 0],
    [0, 0, max],
    [0, max, 0],
    [-max, 0, 0],
    [0, -max, 0],
    [0, 0, -max],
  ];
  return (
    <>
      {arr.map((e, i) => (
        <SolidArrow
          key={i}
          to={e}
          color="rgb(169,169,169)"
          shaftRadius={0.08}
          headLength={0.4}
          headRadius={0.15}
        />
      ))}
      <Plane rotation={[Math.PI / 2, 0, 0]} args={[Math.ceil(max * 2), Math.floor(max * 2)]}>
        <meshBasicMaterial color="cyan" transparent={true} opacity={0.15} side={THREE.DoubleSide} />
      </Plane>

      <Font
        text="X"
        depth={0.05}
        pos={[max, 0, 0]}
        color="rgb(233,222,35)"
        size={0.4}
        opacity={1}
      />
      <Font
        text="Y"
        depth={0.05}
        pos={[-0.1, max, 0]}
        color="rgb(224,32,125)"
        size={0.4}
        opacity={1}
      />
      <Font
        text="Z"
        depth={0.05}
        pos={[0.1, -0.1, max]}
        color="rgb(129,134,234)"
        size={0.4}
        opacity={1}
      />
    </>
  );
}
