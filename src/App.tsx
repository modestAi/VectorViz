import { useSelector } from "react-redux";
import Container from "./components/Container";
import Scene from "./components/Scene";
import type { RootState } from "./store/store";
import { useState } from "react";

function App() {
  const vec = useSelector((data: RootState) => data.vectorList);
  const [cameraReset, setCameraReset] = useState(false);
  let max = 7;

  const requestCameraReset = () => setCameraReset(true);
  const turnOffResetRequest = () => setCameraReset(false);

  (function updateMax() {
    if (vec.length > 0) {
      const arr = vec
        .map((e) => {
          return [Math.abs(e.vector.x), Math.abs(e.vector.y), Math.abs(e.vector.z)];
        })
        .flatMap((e) => e);

      let temp = Math.max(...arr);
      if (temp > max) max = temp;
    }
  })();

  return (
    <div className="flex-1 bg-[rgb(15,21,36)]">
      <Container onReset={requestCameraReset} currentState={cameraReset} />
      <Scene max={max} afterReset={turnOffResetRequest} cameraResetRequestState={cameraReset} />
    </div>
  );
}

export default App;
