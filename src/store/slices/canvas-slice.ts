import { StateCreator } from "zustand";
import { fabric } from "fabric";
import { CanvasObject, Position } from "@/context/canvas-context";
import { createShape } from "@/lib/shapes";
import { Image } from "fabric/fabric-impl";

export interface CanvasSlice {
  canvas: fabric.Canvas | null;
  selectedObject: CanvasObject | null;
  position: Position;
  objectCount: number;
  isDialogOpen: boolean;

  // Canvas actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setSelectedObject: (object: CanvasObject | null) => void;
  updatePosition: (position: Position) => void;
  incrementObjectCount: () => void;

  // Object actions
  moveObjectForward: (obj: CanvasObject) => void;
  moveObjectBackward: (obj: CanvasObject) => void;
  deleteObject: (obj: CanvasObject) => void;
  duplicateObject: (obj: CanvasObject) => void;

  // Element actions
  addShape: (type: string) => void;
  addImage: (url: string) => void;
  clearCanvas: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;

  // Object control actions
  handleObjectAction: (action: string, object: CanvasObject) => void;
  rotateObject: (object: CanvasObject, angle: number) => void;
  flipObject: (object: CanvasObject, direction: 'horizontal' | 'vertical') => void;
  resetObjectTransform: (object: CanvasObject) => void;
  updateObjectProperties: (object: CanvasObject, properties: Partial<CanvasObject>) => void;
}

export const createCanvasSlice: StateCreator<CanvasSlice> = (set, get) => ({
  canvas: null,
  selectedObject: null,
  position: { top: 0, left: 0 },
  objectCount: 0,
  isDialogOpen: false,

  setCanvas: (canvas) => set({ canvas }),

  setSelectedObject: (object) => {
    set({ selectedObject: object });
    if (object && get().canvas) {
      const zoom = get().canvas!.getZoom();
      const bounds = object.getBoundingRect();
      const offset = get().canvas!.getElement().getBoundingClientRect();

      set({
        position: {
          top: bounds.top * zoom + offset.top,
          left: bounds.left * zoom + offset.left,
        },
      });
    }
  },

  updatePosition: (position) => set({ position }),

  incrementObjectCount: () =>
    set((state) => ({
      objectCount: state.objectCount + 1,
    })),

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

  deleteObject: (obj) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.remove(obj);
    set({ selectedObject: null });
  },

  duplicateObject: (obj) => {
    const { canvas, incrementObjectCount } = get();
    if (!canvas) return;

    obj.clone((cloned: fabric.Object) => {
      const newObj = cloned as CanvasObject;
      newObj.set({
        left: obj.left! + 20,
        top: obj.top! + 20,
        id: `object_${Date.now()}`,
        objectType: obj.objectType,
      });

      canvas.add(newObj);
      canvas.setActiveObject(newObj);
      canvas.renderAll();
      incrementObjectCount();
    });
  },

  addShape: (type: string) => {
    const { canvas, incrementObjectCount } = get();
    if (!canvas) return;

    const shape = createShape({ canvas, type });
    if (shape) {
      shape.set({
        objectType: "shape",
        id: `${type}_${Date.now()}`,
      } as Partial<CanvasObject>);

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.centerObject(shape);
      canvas.renderAll();
      incrementObjectCount();
    }
  },

  addImage: (url: string) => {
    const { canvas, incrementObjectCount, setIsDialogOpen } = get();
    if (!canvas) return;

    fabric.Image.fromURL(url, (img) => {
      const maxSize = 300;
      const scale = Math.min(maxSize / img.width!, maxSize / img.height!);

      img.set({
        scaleX: scale,
        scaleY: scale,
        objectType: "image",
        id: `image_${Date.now()}`,
      } as Partial<Image>);

      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      incrementObjectCount();
    });

    setIsDialogOpen(false);
  },

  clearCanvas: () => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.clear();
    canvas.renderAll();
  },

  setIsDialogOpen: (isOpen: boolean) => set({ isDialogOpen: isOpen }),

  handleObjectAction: (action: string, object: CanvasObject) => {
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
        get().flipObject(object, 'horizontal');
        break;

      case "flipVertical":
        get().flipObject(object, 'vertical');
        break;

      case "resetImage":
        get().resetObjectTransform(object);
        break;

      case "delete":
        get().deleteObject(object);
        break;
    }

    canvas.renderAll();
  },

  rotateObject: (object, angle) => {
    object.rotate!((object.angle || 0) + angle);
    get().canvas?.renderAll();
  },

  flipObject: (object, direction) => {
    if (direction === 'horizontal') {
      object.set('flipX', !object.flipX);
    } else {
      object.set('flipY', !object.flipY);
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
