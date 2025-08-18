import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { SolidArrow } from "./scene-components/SolidArrow";
import { CoordinateSystem } from "./scene-components/CoordinateSystem";
import { Point } from "./scene-components/Point";
import { Lights } from "./scene-components/Lights";

type SceneProps = {
  afterReset: () => void;
  cameraResetRequestState: boolean;
};

export default function Scene({ afterReset, cameraResetRequestState }: SceneProps) {
  const max = useSelector((data: RootState) => data.sceneConfig.maxDist);
  const panToPosition = useMemo(() => new THREE.Vector3(1, 1, max + 1), [max]);
  const controlsRef = useRef<CameraControls>(null!);
  const ref = useRef<HTMLCanvasElement | null>(null);

  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 2]}
      ref={ref}
      className="canvas"
      camera={{ fov: 90, near: 0.01, far: 2000, position: [1, 1, max + 1] }}
    >
      <SceneContents
        defaultPos={panToPosition}
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
  defaultPos: THREE.Vector3;
  controlsRef: React.RefObject<CameraControls>;
  cameraResetRequestState: boolean;
  afterReset: () => void;
}) {
  const three = useThree();
  const { x, y, z } = defaultPos;

  const state = useSelector((state: RootState) => state, {
    devModeChecks: { stabilityCheck: "never" },
  });

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
      {state.vectorList.map((v) =>
        state.sceneConfig.type === "Vector" ? (
          <SolidArrow
            key={v.id}
            from={[0, 0, 0]}
            to={[v.vector.x, v.vector.y, v.vector.z]}
            color={v.color}
            headLength={0.4}
            headRadius={0.1}
            shaftRadius={0.06}
            isShowable={true}
          />
        ) : (
          <Point key={v.id} vec={v} />
        )
      )}
      <Lights />
      <CameraControls polarRotateSpeed={0.5} azimuthRotateSpeed={0.5} ref={controlsRef} />
    </>
  );
}
