import { configureStore } from "@reduxjs/toolkit";
import VectorReducer from "./VectorSlice";
import SceneConfigReducer from "./SceneConfigSlice";

export const store = configureStore({
  reducer: {
    vectorList: VectorReducer,
    sceneConfig: SceneConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
