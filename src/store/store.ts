import { configureStore } from "@reduxjs/toolkit";
import VectorReducer from "./VectorSlice";

export const store = configureStore({
  reducer: {
    vectorList: VectorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
