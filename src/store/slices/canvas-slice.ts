import { StateCreator } from "zustand";
import { fabric } from "fabric";
import { CanvasObject, Position } from "../types";
import { RootState } from "../index";

export interface CanvasSlice {
  // Core canvas state
  canvas: fabric.Canvas | null;
  selectedObject: CanvasObject | null;
  position: Position;

  // Core canvas actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setSelectedObject: (object: CanvasObject | null) => void;
  initializeCanvas: (canvasElement: HTMLCanvasElement) => fabric.Canvas;
  handleObjectAction: (
    action: string, 
    object: CanvasObject, 
    options?: Record<string, unknown>
  ) => void;
}

export const createCanvasSlice: StateCreator<
  RootState,
  [],
  [],
  CanvasSlice
> = (set, get) => ({
  // Initial state
  canvas: null,
  selectedObject: null,
  position: { top: 0, left: 0 },

  setCanvas: (canvas) => set({ canvas }),

  setSelectedObject: (object) => {
    set({ selectedObject: object });
  },

  initializeCanvas: (canvasElement) => {
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
    });

    fabricCanvas.on("object:added", (e) => {
      const obj = e.target as CanvasObject;
      if (obj) {
        const newId = `object_${Date.now()}_${get().objectCount}`;
        obj.set({
          id: newId,
          zIndex: get().objectCount + 1,
        });

        if (!obj.left || !obj.top) {
          fabricCanvas.centerObject(obj);
        }

        get().incrementObjectCount();
        fabricCanvas.renderAll();
      }
    });

    set({ canvas: fabricCanvas });
    return fabricCanvas;
  },

  handleObjectAction: (action: string, object: CanvasObject, options?: Record<string, unknown>) => {
    const { canvas } = get();
    if (!canvas || !object) return;

    switch (action) {
      case "duplicate":
        get().duplicateObject(object);
        break;

      case "rotate":
        get().rotateObject(object, 90);
        break;

      case "moveForward":
        get().moveObjectForward(object);
        break;

      case "moveBackward":
        get().moveObjectBackward(object);
        break;

      case "flipHorizontal":
        get().flipObject(object, "horizontal");
        break;

      case "flipVertical":
        get().flipObject(object, "vertical");
        break;

      case "resetImage":
        get().resetObjectTransform(object);
        break;

      case "delete":
        get().deleteObject(object);
        break;

      case "changeFill":
        if (options?.color) {
          get().changeFillColor(object, options.color as string);
        }
        break;

      case "cropImage":
        if (object.type === 'image') {
          get().startCropping(object);
        }
        break;
    }

    canvas.renderAll();
  },
});
