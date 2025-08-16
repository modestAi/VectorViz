import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import React from "react";
import Font from "./Font";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { SolidArrow } from "./scene-components/SolidArrow";
import { CoordinateSystem } from "./scene-components/CoordinateSystem";
import { CircleContainer } from "./scene-components/CircleContainer";
import { Lights } from "./scene-components/Lights";

type SceneProps = {
  max?: number;
  afterReset: () => void;
  cameraResetRequestState: boolean;
};

export default function Scene({ afterReset, cameraResetRequestState, max = 10 }: SceneProps) {
  const defaultPos = useMemo(() => new THREE.Vector3(1, 1, max + 1), [max]);
  const controlsRef = useRef<CameraControls>(null!); //Will exist

  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={{ fov: 90, near: 0.01, far: 2000, position: [1, 1, max + 1] }}
    >
      <SceneContents
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
  max,
  defaultPos,
  controlsRef,
  cameraResetRequestState,
  afterReset,
}: {
  max: number;
  defaultPos: THREE.Vector3;
  controlsRef: React.RefObject<CameraControls>; // OK now
  cameraResetRequestState: boolean;
  afterReset: () => void;
}) {
  const three = useThree();
  const state = useSelector((state: RootState) => state);
  const { x, y, z } = defaultPos;

  // Set initial camera position before first frame
  useLayoutEffect(() => {
    three.camera.position.copy(defaultPos);
  }, [three.camera, defaultPos]);

  // Trigger reset animation
  useLayoutEffect(() => {
    if (cameraResetRequestState && controlsRef.current) {
      controlsRef.current.setLookAt(x, y, z, 0, 0, 0, true);

      const doAfterCameraTransition = () => {
        afterReset();
        controlsRef.current.removeEventListener("sleep", doAfterCameraTransition);
      };

      controlsRef.current.addEventListener("sleep", doAfterCameraTransition);
    }
  }, [cameraResetRequestState, controlsRef, afterReset, defaultPos]);

  return (
    <>
      <CoordinateSystem max={max} />
      {state.vectorList.map((v) => (
        <React.Fragment key={v.id}>
          {state.sceneConfig.type === "Vector" ? (
            <SolidArrow from={[0, 0, 0]} to={v.vector.toArray()} />
          ) : (
            <CircleContainer vec={v} />
          )}
        </React.Fragment>
      ))}

      <Font text="X" pos={[max, -0.1, -0.1]} color="rgb(2,322,35)" size={0.3} opacity={1} />
      <Font text="Y" pos={[-0.1, max, 0]} color="rgb(212,25,35)" size={0.3} opacity={1} />
      <Font text="Z" pos={[0.1, -0.1, max]} color="rgb(0,0,235)" size={0.3} opacity={1} />

      <Lights max={max} />
      <CameraControls dampingFactor={1} azimuthRotateSpeed={0.75} ref={controlsRef} />
    </>
  );
}
