import { StateCreator } from "zustand";
import { CanvasObject } from "../types";
import { RootState } from "../index";

export interface LayerSlice {
  moveObjectForward: (obj: CanvasObject) => void;
  moveObjectBackward: (obj: CanvasObject) => void;
  bringToFront: (obj: CanvasObject) => void;
  sendToBack: (obj: CanvasObject) => void;
}

export const createLayerSlice: StateCreator<
  RootState,
  [],
  [],
  LayerSlice
> = (_set, get) => ({
  moveObjectForward: (obj) => {
    const { canvas } = get();
    if (!canvas) return;
    obj.bringForward();
    canvas.renderAll();
  },

  moveObjectBackward: (obj) => {
    const { canvas } = get();
    if (!canvas) return;
    obj.sendBackwards();
    canvas.renderAll();
  },

  bringToFront: (obj) => {
    const { canvas } = get();
    if (!canvas) return;
    obj.bringToFront();
    canvas.renderAll();
  },

  sendToBack: (obj) => {
    const { canvas } = get();
    if (!canvas) return;
    obj.sendToBack();
    canvas.renderAll();
  },
});