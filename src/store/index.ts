import { create } from 'zustand';
import { CanvasSlice, createCanvasSlice } from './slices/canvas-slice';
import { ObjectSlice, createObjectSlice } from './slices/object-slice';
import { TransformSlice, createTransformSlice } from './slices/transform-slice';
import { LayerSlice, createLayerSlice } from './slices/layer-slice';
import { createStyleSlice, StyleSlice } from './slices/style-slice';
import { ImageSlice, createImageSlice } from './slices/image-slice';


export interface RootState extends 
  CanvasSlice,
  ObjectSlice,
  TransformSlice,
  LayerSlice,
  StyleSlice,
  ImageSlice {}

export const useStore = create<RootState>()((...args) => ({
  ...createCanvasSlice(...args),
  ...createObjectSlice(...args),
  ...createTransformSlice(...args),
  ...createLayerSlice(...args),
  ...createStyleSlice(...args),
  ...createImageSlice(...args),
}));