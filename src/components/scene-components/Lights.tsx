import type React from "react";

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color="white" />
      <directionalLight position={[0, +40, 0]} intensity={1.2} color="white" />
    </>
  );
}
