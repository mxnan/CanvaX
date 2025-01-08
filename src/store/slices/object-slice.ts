import { StateCreator } from "zustand";
import { fabric } from "fabric";
import { CanvasObject } from "../types";
import { RootState } from "../index";
import { createShape } from "@/lib/shapes";
import { Image } from "fabric/fabric-impl";
import { toast } from "sonner";

export interface ObjectSlice {
  objectCount: number;
  isDialogOpen: boolean;
  incrementObjectCount: () => void;
  addShape: (type: string) => void;
  addImage: (url: string) => void;
  deleteObject: (obj: CanvasObject) => void;
  duplicateObject: (obj: CanvasObject) => void;
  clearCanvas: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export const createObjectSlice: StateCreator<RootState, [], [], ObjectSlice> = (
  set,
  get
) => ({
  objectCount: 0,
  isDialogOpen: false,

  incrementObjectCount: () =>
    set((state) => ({ objectCount: state.objectCount + 1 })),

  setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),

  addShape: (type) => {
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

  addImage: (url) => {
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

  clearCanvas: () => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.clear();
    toast.success("cleared");
    canvas.renderAll();
  },
});
