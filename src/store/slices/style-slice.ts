import { StateCreator } from "zustand";
import { CanvasObject } from "../types";
import { RootState } from "../index";

export interface StyleSlice {
  changeFillColor: (object: CanvasObject, color: string) => void;
}

export const createStyleSlice: StateCreator<RootState, [], [], StyleSlice> = (
  _set,
  get
) => ({
  changeFillColor: (object, color) => {
    if (!object) return;
    object.set("fill", color);
    get().canvas?.renderAll();
  },
});
