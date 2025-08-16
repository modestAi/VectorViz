export function Lights({ max }: { max: number }) {
  return (
    <>
      <ambientLight intensity={0.6} color="white" />
      <directionalLight position={[max, 0, 0]} intensity={1.2} color="white" />
      <directionalLight position={[0, 0, max]} intensity={1.2} color="white" />
      <directionalLight position={[0, max, 0]} intensity={1.2} color="white" />
    </>
  );
}
