import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export function Lights() {
  const selector = useSelector((data: RootState) => data);

  const max = selector.sceneConfig.maxDist;
  return (
    <>
      <ambientLight intensity={0.3} color="white" />
      <directionalLight position={[max, max, 0]} intensity={0.4} color="white" />
      <directionalLight position={[0, max, max]} intensity={0.4} color="white" />
      <directionalLight position={[max, 0, max]} intensity={0.4} color="white" />
    </>
  );
}
