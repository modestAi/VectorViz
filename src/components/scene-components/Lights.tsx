import type React from "react";

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 20, 0]} intensity={1.2} color="white" />
    </>
  );
}
