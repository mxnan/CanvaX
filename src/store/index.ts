import { create } from 'zustand';
import { CanvasSlice, createCanvasSlice } from './slices/canvas-slice';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StoreState extends CanvasSlice {
  // Add other slices here later (auth, settings, etc.)
}

export const useStore = create<StoreState>()((...args) => ({
  ...createCanvasSlice(...args),
}));