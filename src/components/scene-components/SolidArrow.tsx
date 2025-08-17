import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import Text3D from "./Font";
import type { CoordTuple } from "../../utils/Types";

type SolidArrowProps = {
  from?: CoordTuple;
  to: CoordTuple;
  shaftRadius?: number;
  headLength?: number;
  headRadius?: number;
  color?: string;
  isShowable?: boolean;
};
export function SolidArrow({
  from = [0, 0, 0],
  color = "red",
  headLength = 0.2,
  headRadius = 0.25,
  isShowable = false,
  shaftRadius = 0.1,
  to,
  onHoverChange,
}: SolidArrowProps & { onHoverChange?: (hover: boolean) => void }) {
  const [show, setShow] = useState(false);

  const { dir, shaftLength } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const fullDir = new THREE.Vector3().subVectors(end, start);
    const length = fullDir.length();
    return { dir: fullDir.normalize(), shaftLength: length - headLength };
  }, [from, to, headLength]);

  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); // orient along arrow direction from y axis (three js def.)
    return q;
  }, [dir]);

  const handleEnter = () => onHoverChange?.(true);
  const handleLeave = () => onHoverChange?.(false);

  return (
    <group position={from} quaternion={quat}>
      <mesh
        position={[0, shaftLength / 2, 0]}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={() => setShow((prev) => !prev)}
      >
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh
        position={[0, shaftLength + headLength / 2, 0]}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={() => setShow((prev) => !prev)}
      >
        <coneGeometry args={[headRadius, headLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {show && isShowable && (
        <Text3D
          text={`(${to[0]},${to[1]},${to[2]})`}
          pos={[0.1, shaftLength + headLength + 0.1, 0.1]}
          color="gold"
          size={0.2}
          opacity={0.75}
          faceCamera
        />
      )}
    </group>
  );
}
