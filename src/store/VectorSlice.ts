import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { Color } from "../utils/Colors";

type CoordinateType = {
  x: number;
  y: number;
  z: number;
};

export type VectorType = {
  id: string;
  vector: CoordinateType;
  color: string;
};

// default seed vectors
const seedVectors = [
  new THREE.Vector3(3, 1, -4),
  new THREE.Vector3(3, 1, 3),
  new THREE.Vector3(2, 2, -1),
  new THREE.Vector3(1, -2, -3),
];

const initialState: VectorType[] = seedVectors.map((vec) => ({
  id: uuidv4(),
  vector: { x: vec.x, y: vec.y, z: vec.z },
  color: Color.randomColor(),
}));

const VecSlice = createSlice({
  name: "vectorSlice",
  initialState,
  reducers: {
    addVector: (state, action: PayloadAction<VectorType>) => {
      const vecList = state.map((e) => e.vector);
      if (!vecExists(vecList, action.payload.vector)) state.push(action.payload);
      return state;
    },
    delVector: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((vec) => vec.id !== action.payload.id);
    },
    updateVector: (state, action: PayloadAction<{ vector: VectorType }>) => {
      const index = state.findIndex((e) => e.id === action.payload.vector.id);
      if (index >= 0) {
        state[index] = action.payload.vector;
      }
    },
  },
});

function vecExists(vecList: CoordinateType[], vec2: CoordinateType) {
  return vecList.some((vec1) => {
    if (vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z) return true;
    else return false;
  });
}

export const { addVector, delVector, updateVector } = VecSlice.actions;
export default VecSlice.reducer;
