import { useSelector } from "react-redux";
import Container from "./components/Container";
import Scene from "./components/Scene";
import type { RootState } from "./store/store";
import { useState } from "react";

function App() {
  const vec = useSelector((data: RootState) => data.vectorList);
  const [cameraReset, setCameraReset] = useState(false);
  let max = 7;

  function requestCameraReset() {
    setCameraReset(true);
  }

  function turnOffRequest() {
    setCameraReset(false);
  }

  if (vec.length > 0) {
    const arr = vec
      .map((e) => {
        return [Math.abs(e.vector.x), Math.abs(e.vector.y), Math.abs(e.vector.z)];
      })
      .flatMap((e) => e);

    let temp = Math.max(...arr);
    if (temp > max) max = temp;
  }

  return (
    <div className="flex-1 bg-[rgb(15,21,36)]">
      <Container onReset={requestCameraReset} />

      <Scene max={max} afterReset={turnOffRequest} cameraResetRequestState={cameraReset} />
      {/* <p className=" absolute top-20 left-20 z-2 p-5 m-5 text-4xl text-amber-50">{max}</p> */}
    </div>
  );
}

export default App;
