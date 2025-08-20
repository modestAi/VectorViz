import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { CoordTuple } from "../../utils/Types";

export function Lights() {
  const max = useSelector((data: RootState) => data.sceneConfig.maxDist);

  const color = new String("white");
  const intensity = new Number(0.4);

  const dirLightPositions: CoordTuple[] = [
    [max, max, 0],
    [0, max, max],
    [max, 0, max],
    [-max, -max, 0],
    [0, -max, -max],
    [-max, 0, -max]
  ]

  return (
    <>
      <ambientLight intensity={0.3} color="rgb(270,215,215)" />
      {dirLightPositions.map(e => <directionalLight position={e} {...color} {...intensity} />)}
    </>
  );
}
