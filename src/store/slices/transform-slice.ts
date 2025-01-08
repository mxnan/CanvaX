import { StateCreator } from "zustand";
import { CanvasObject } from "../types";
import { RootState } from "../index";

export interface TransformSlice {
  rotateObject: (object: CanvasObject, angle: number) => void;
  flipObject: (
    object: CanvasObject,
    direction: "horizontal" | "vertical"
  ) => void;
  resetObjectTransform: (object: CanvasObject) => void;
  updateObjectProperties: (
    object: CanvasObject,
    properties: Partial<CanvasObject>
  ) => void;
}

export const createTransformSlice: StateCreator<
  RootState,
  [],
  [],
  TransformSlice
> = (set, get) => ({
  rotateObject: (object, angle) => {
    object.rotate!((object.angle || 0) + angle);
    get().canvas?.renderAll();
  },

  flipObject: (object, direction) => {
    if (direction === "horizontal") {
      object.set("flipX", !object.flipX);
    } else {
      object.set("flipY", !object.flipY);
    }
    get().canvas?.renderAll();
  },

  resetObjectTransform: (object) => {
    object.set({
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
    });
    get().canvas?.renderAll();
  },

  updateObjectProperties: (object, properties) => {
    object.set(properties);
    get().canvas?.renderAll();
  },
});
