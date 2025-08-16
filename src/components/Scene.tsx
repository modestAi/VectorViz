import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CameraControls, Plane } from "@react-three/drei";
import type { VectorType } from "../store/VectorSlice";
import Text3D from "./Font";
import React from "react";
import Font from "./Font";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type SceneProps = {
  max?: number;
  afterReset: () => void;
  cameraResetRequestState: boolean;
};
export default function Scene({ afterReset, cameraResetRequestState, max = 10 }: SceneProps) {
  const vecList = useSelector((state: RootState) => state.vectorList);
  const defaultPos = useMemo(() => new THREE.Vector3(1, 1, max + 1), [max]);

  const controlsRef = useRef<CameraControls>(null!); //Will exist

  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={{ fov: 90, near: 0.01, far: 2000, position: [1, 1, max + 1] }}
    >
      <SceneContents
        vecList={vecList}
        max={max}
        defaultPos={defaultPos}
        controlsRef={controlsRef}
        cameraResetRequestState={cameraResetRequestState}
        afterReset={afterReset}
      />
    </Canvas>
  );
}

function SceneContents({
  vecList,
  max,
  defaultPos,
  controlsRef,
  cameraResetRequestState,
  afterReset,
}: {
  vecList: VectorType[];
  max: number;
  defaultPos: THREE.Vector3;
  controlsRef: React.RefObject<CameraControls>; // OK now
  cameraResetRequestState: boolean;
  afterReset: () => void;
}) {
  const { camera } = useThree();

  const { x, y, z } = defaultPos;

  // Set initial camera position before first frame
  useLayoutEffect(() => {
    camera.position.copy(defaultPos);
  }, [camera, defaultPos]);

  // Trigger reset animation
  useLayoutEffect(() => {
    if (cameraResetRequestState && controlsRef.current) {
      controlsRef.current.setLookAt(x, y, z, 0, 0, 0, true);

      const handleRest = () => {
        afterReset();
        controlsRef.current.removeEventListener("sleep", handleRest);
      };

      controlsRef.current.addEventListener("sleep", handleRest);
    }
  }, [cameraResetRequestState, controlsRef, afterReset, defaultPos]);

  return (
    <>
      <CoordinateSystem max={max} />
      {vecList.map((v) => (
        <React.Fragment key={v.id}>
          <SolidArrow from={[0, 0, 0]} to={v.vector.toArray()} />
          <CircleContainer vec={v} />
        </React.Fragment>
      ))}

      <Font text="X" pos={[max, -0.1, -0.1]} color="rgb(2,322,35)" size={0.3} opacity={1} />
      <Font text="Y" pos={[-0.1, max, 0]} color="rgb(212,25,35)" size={0.3} opacity={1} />
      <Font text="Z" pos={[0.1, -0.1, max]} color="rgb(0,0,235)" size={0.3} opacity={1} />

      <Lights />
      <CameraControls ref={controlsRef} />
    </>
  );
}

function CircleContainer({ vec }: { vec: VectorType }) {
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

type SolidArrowProps = {
  from?: [number, number, number];
  to?: [number, number, number];
  shaftRadius?: number;
  headLength?: number;
  headRadius?: number;
  color?: string;
};

function SolidArrow({
  from = [0, 0, 0],
  to = [1, 0, 0],
  shaftRadius = 0.02,
  headLength = 0.2,
  headRadius = 0.06,
  color = "red",
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

function CoordinateSystem(props: { max: number }) {
  const { max } = props;

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
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />

      <directionalLight position={[0, 20, 0]} intensity={1.2} color="white" />
      {/* <directionalLight position={[-5, 5, -5]} intensity={1.2} color="white" />
      <directionalLight position={[5, 5, 5]} intensity={1.3} color="white" /> */}
    </>
  );
}
// const len = vecList.length;
// Avg center pos??? center of mass later or smth???? idk
// const getPos = useCallback(
//   (type: "x" | "y" | "z") => {
//     return vecList.map((e) => e.vector[type]).reduce((a, c) => a + c, 0) / len;
//   },
//   [vecList]
// );
// if (len > 0) {
//   posX = getPos("x");
//   posY = getPos("y");
//   posZ = getPos("z");
// }
