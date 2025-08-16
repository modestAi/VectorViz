import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ConfigState = { type: "Vector" | "Point"; maxDist: number };
const configSlice = createSlice({
  name: "sceneConfigState",
  initialState: { type: "Vector", maxDist: 10 } as ConfigState,
  reducers: {
    setType: (state, action: PayloadAction<ConfigState["type"]>) => {
      state.type = action.payload;
      return state;
    },

    setMaxDist: (state, action: PayloadAction<ConfigState["maxDist"]>) => {
      state.maxDist = action.payload;
      return state;
    },
  },
});

export const { setType, setMaxDist } = configSlice.actions;

export default configSlice.reducer;
