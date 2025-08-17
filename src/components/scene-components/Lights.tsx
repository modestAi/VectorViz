import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export function Lights() {
  const max = useSelector((data: RootState) => data.sceneConfig.maxDist);

  const color = new String("white");
  const intensity = new Number(0.4);

  return (
    <>
      <ambientLight intensity={0.3} color="rgb(255,255,255)" />
      <directionalLight position={[max, max, 0]} {...color} {...intensity} />
      <directionalLight position={[0, max, max]} {...color} {...intensity} />
      <directionalLight position={[max, 0, max]} {...color} {...intensity} />
      <directionalLight position={[-max, -max, 0]} {...intensity} {...color} />
      <directionalLight position={[0, -max, -max]} {...intensity} {...color} />
      <directionalLight position={[-max, 0, -max]} {...intensity} {...color} />
    </>
  );
}
