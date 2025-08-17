import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import React from "react";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { SolidArrow } from "./scene-components/SolidArrow";
import { CoordinateSystem } from "./scene-components/CoordinateSystem";
import { CircleContainer } from "./scene-components/CircleContainer";
import { Lights } from "./scene-components/Lights";
import Font from "./scene-components/Font";

type SceneProps = {
  afterReset: () => void;
  cameraResetRequestState: boolean;
};

export default function Scene({ afterReset, cameraResetRequestState }: SceneProps) {
  const selector = useSelector((data: RootState) => data);

  const max = selector.sceneConfig.maxDist;
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
  const selector = useSelector((data: RootState) => data);

  const max = selector.sceneConfig.maxDist;
  const three = useThree();
  const state = useSelector((state: RootState) => state);
  const { x, y, z } = defaultPos;

  // Set initial camera position before first frame
  useLayoutEffect(() => {
    three.camera.position.copy(defaultPos);
  }, [three.camera, defaultPos]);

  // Trigger reset animation
  useLayoutEffect(() => {
    const doAfterCameraTransition = () => {
      afterReset();
      controlsRef.current.removeEventListener("rest", doAfterCameraTransition);
    };
    if (cameraResetRequestState && controlsRef.current) {
      controlsRef.current.setLookAt(x, y, z, 0, 0, 0, true);

      controlsRef.current.addEventListener("rest", doAfterCameraTransition);
    }

    return () => controlsRef.current.removeEventListener("rest", doAfterCameraTransition);
  }, [cameraResetRequestState, controlsRef, afterReset, defaultPos]);

  return (
    <>
      <CoordinateSystem />
      {state.vectorList.map((v) => (
        <React.Fragment key={v.id}>
          {state.sceneConfig.type === "Vector" ? (
            <SolidArrow from={[0, 0, 0]} to={v.vector.toArray()} />
          ) : (
            <CircleContainer vec={v} />
          )}
        </React.Fragment>
      ))}



      <Lights />
      <CameraControls dampingFactor={1} azimuthRotateSpeed={0.75} ref={controlsRef} />
    </>
  );
}
