import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls, CameraControls, Plane } from "@react-three/drei";
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
  const vecList = useSelector((data: RootState) => data.vectorList);

  const defaultPos = useRef<[number, number, number]>([1, 1, max + 1]);
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000)
  );

  // Set initial camera position only once
  useEffect(() => {
    cameraRef.current.position.set(...defaultPos.current);
  }, []);

  const [animate, setAnimate] = useState(false);

  // Reset camera position when requested
  useEffect(() => {
    if (cameraResetRequestState) {
      setAnimate(true);
      afterReset();
    }
  }, [cameraResetRequestState, afterReset]);

  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]} camera={cameraRef.current}>
      <CoordinateSystem max={max} />

      {vecList.map((v) => (
        <React.Fragment key={v.id}>
          <SolidArrow from={[0, 0, 0]} to={v.vector.toArray()} />
          <CircleContainer vec={v} />
        </React.Fragment>
      ))}
      {animate && (
        <AnimateTransition
          animateTo={
            new THREE.Vector3(defaultPos.current[0], defaultPos.current[1], defaultPos.current[2])
          }
          afterAnimate={() => setAnimate(false)}
        />
      )}
      <Font text="X" pos={[max, -0.1, -0.1]} color="rgb(2,322,35)" size={0.3} opacity={1} />
      <Font text="Y" pos={[-0.1, max, 0]} color="rgb(212,25,35)" size={0.3} opacity={1} />
      <Font text="Z" pos={[0.1, -0.1, max]} color="rgb(0,0,235)" size={0.3} opacity={1} />

      <Lights />
      <OrbitControls dampingFactor={0.1} />
    </Canvas>
  );
}

function AnimateTransition({
  animateTo,
  afterAnimate,
}: {
  animateTo: THREE.Vector3;
  afterAnimate: () => void;
}) {
  const controlsRef = useRef<CameraControls | null>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleRest = () => {
      afterAnimate();
      controls.removeEventListener("rest", handleRest);
    };

    controls.addEventListener("rest", handleRest);

    controls.setLookAt(
      animateTo.x, // final camera position
      animateTo.y,
      animateTo.z,
      0, // look-at target (center)
      0,
      0,
      true
    );

    return () => controls.removeEventListener("rest", handleRest);
  }, [animateTo, afterAnimate]);

  return <CameraControls ref={controlsRef} />;
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
