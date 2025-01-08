import { create } from 'zustand';
import { CanvasSlice, createCanvasSlice } from './slices/canvas-slice';
import { ObjectSlice, createObjectSlice } from './slices/object-slice';
import { TransformSlice, createTransformSlice } from './slices/transform-slice';
import { LayerSlice, createLayerSlice } from './slices/layer-slice';
import { createStyleSlice, StyleSlice } from './slices/style-slice';


export interface RootState extends 
  CanvasSlice,
  ObjectSlice,
  TransformSlice,
  LayerSlice,
  StyleSlice  {}

export const useStore = create<RootState>()((...args) => ({
  ...createCanvasSlice(...args),
  ...createObjectSlice(...args),
  ...createTransformSlice(...args),
  ...createLayerSlice(...args),
  ...createStyleSlice(...args),
}));