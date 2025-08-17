import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

export type VectorType = {
  id: string;
  vector: THREE.Vector3;
};

// some default seed vectors
const seedVectors = [
  new THREE.Vector3(5, 3, 4),
  new THREE.Vector3(3, 1, -4),
  new THREE.Vector3(-2, 4, 1),
  new THREE.Vector3(0, -3, 5),
  new THREE.Vector3(2, -2, -1),
  new THREE.Vector3(-5, 0, 2),
  new THREE.Vector3(1, -2, -3),
  new THREE.Vector3(-4, -2, -1),
];

// attach ids
const initialState: VectorType[] = seedVectors.map((vec) => ({
  id: uuidv4(),
  vector: vec,
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
        state[index] = action.payload.vector; // mutate directly
      }
    },
  },
});

function vecExists(vecList: THREE.Vector3[], vec2: THREE.Vector3) {
  return vecList.some((vec) => vec.equals(vec2));
}

export const { addVector, delVector, updateVector } = VecSlice.actions;
export default VecSlice.reducer;
