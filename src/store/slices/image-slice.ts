import { StateCreator } from "zustand";
import { fabric } from "fabric";
import { CanvasObject } from "../types";
import { RootState } from "../index";
import { Image } from "fabric/fabric-impl";

export interface ImageSlice {
  isCropping: boolean;
  cropObject: fabric.Image | null;
  startCropping: (object: CanvasObject) => void;
  applyCrop: () => void;
}

export const createImageSlice: StateCreator<
  RootState,
  [],
  [],
  ImageSlice
> = (set, get) => ({
  isCropping: false,
  cropObject: null,

  startCropping: (object) => {
    const { canvas } = get();
    if (!canvas || object.type !== 'image') return;

    const image = object as fabric.Image;
    const cropArea = new fabric.Rect({
      left: image.left,
      top: image.top,
      width: image.width! * image.scaleX!,
      height: image.height! * image.scaleY!,
      fill: 'transparent',
      stroke: '#fff',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      cornerColor: 'white',
      cornerSize: 10,
    });

    canvas.add(cropArea);
    canvas.setActiveObject(cropArea);
    set({ isCropping: true, cropObject: image });
    canvas.renderAll();
  },

  applyCrop: () => {
    const { canvas, cropObject, incrementObjectCount } = get();
    if (!canvas || !cropObject) return;

    const cropArea = canvas.getActiveObject();
    if (!cropArea) return;

    const imageElement = cropObject.getElement();
    const cropBounds = cropArea.getBoundingRect();
    const imageBounds = cropObject.getBoundingRect();

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = cropBounds.width;
    tempCanvas.height = cropBounds.height;

    tempCtx.drawImage(
      imageElement,
      (cropBounds.left - imageBounds.left) / cropObject.scaleX!,
      (cropBounds.top - imageBounds.top) / cropObject.scaleY!,
      cropBounds.width / cropObject.scaleX!,
      cropBounds.height / cropObject.scaleY!,
      0,
      0,
      cropBounds.width,
      cropBounds.height
    );

    const dataUrl = tempCanvas.toDataURL(cropObject.type);
    fabric.Image.fromURL(dataUrl, (newImage) => {
      newImage.set({
        left: cropBounds.left,
        top: cropBounds.top,
        objectType: "image",
        id: `image_${Date.now()}`,
        selectable: true,
        evented: true,
      } as Partial<Image>);

      canvas.add(newImage);
      canvas.setActiveObject(newImage);
      incrementObjectCount();

      canvas.remove(cropArea);
      set({ isCropping: false, cropObject: null });
      canvas.renderAll();
    });
  },
});