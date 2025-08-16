import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { useState, useMemo, lazy, Suspense } from "react";
import Spinner from "./components/Spinner";

const Scene = lazy(() => import("./components/Scene"));
const Container = lazy(() => import("./components/Container"));

function App() {
  const vecList = useSelector((state: RootState) => state.vectorList);
  const [cameraReset, setCameraReset] = useState(false);

  const requestCameraReset = () => setCameraReset(true);
  const turnOffResetRequest = () => setCameraReset(false);

  const max = useMemo(() => {
    if (vecList.length === 0) return 7;
    return Math.max(
      7,
      ...vecList.flatMap((v) => [Math.abs(v.vector.x), Math.abs(v.vector.y), Math.abs(v.vector.z)])
    );
  }, [vecList]);

  return (
    <div className="flex-1 bg-[rgb(15,21,36)]">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-50  ">
            <Spinner />
          </div>
        }
      >
        <Container onReset={requestCameraReset} currentState={cameraReset} />

        <Scene max={max} afterReset={turnOffResetRequest} cameraResetRequestState={cameraReset} />
      </Suspense>
    </div>
  );
}

export default App;
