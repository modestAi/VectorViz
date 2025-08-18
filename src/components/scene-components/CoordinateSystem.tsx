import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { SolidArrow } from "./SolidArrow";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import Text3D from "./Text3D";
import type { CoordTuple } from "../../utils/Types";

export function CoordinateSystem() {
  const max = useSelector((data: RootState) => data.sceneConfig.maxDist);
  const axes: {
    label: string;
    dir: CoordTuple;
    color: string;
  }[] = [
      { label: "X", dir: [max, 0, 0], color: "rgb(233,210,135)" },
      { label: "Y", dir: [0, max, 0], color: "rgb(224,132,125)" },
      { label: "Z", dir: [0, 0, max], color: "rgb(129,134,234)" },
      { label: "-X", dir: [-max, 0, 0], color: "rgb(233,210,135)" },
      { label: "-Y", dir: [0, -max, 0], color: "rgb(224,132,125)" },
      { label: "-Z", dir: [0, 0, -max], color: "rgb(129,134,234)" },
    ];

  return (
    <>
      {axes.map((axis, i) => (
        <SolidArrow
          key={`axis-${i}`}
          to={axis.dir}
          color="rgb(169,169,169)"
          shaftRadius={0.08}
          headLength={0.4}
          headRadius={0.15}
        />
      ))}


      <Plane rotation={[Math.PI / 2, 0, 0]} args={[Math.ceil(max * 2), Math.floor(max * 2)]}>
        <meshBasicMaterial color="cyan" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Plane>


      {axes
        .filter((axis) => !axis.label.startsWith("-"))
        .map((axis, i) => (
          <Text3D
            key={`label-${i}`}
            text={axis.label}
            pos={axis.dir}
            color={axis.color}
            size={0.4}
            opacity={1}
            depth={0.05}
          />
        ))}
    </>
  );
}
