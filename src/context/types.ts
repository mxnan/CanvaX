import { fabric } from "fabric";
import { ReactNode } from "react";


export interface CanvasObject extends fabric.Object {
  id?: string;
  zIndex?: number;
  objectType?: string | "image" | "text" | "shape";

}

export interface CanvasContextValue {
  // Canvas State
  canvas: fabric.Canvas | null;
  selectedObject: CanvasObject | null;
  // position: Position;
  objectCount: number;
  isDialogOpen: boolean;
  isCropping: boolean;

  // Canvas Actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setSelectedObject: (object: CanvasObject | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  incrementObjectCount: () => void;

  // Object Actions
  addShape: (type: string) => void;
  addImage: (url: string) => void;
  deleteObject: (obj: CanvasObject) => void;
  duplicateObject: (obj: CanvasObject) => void;
  clearCanvas: () => void;

  // Layer Actions
  moveObjectForward: (obj: CanvasObject) => void;
  moveObjectBackward: (obj: CanvasObject) => void;
  bringToFront: (obj: CanvasObject) => void;
  sendToBack: (obj: CanvasObject) => void;

  // Transform Actions
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

  // Style Actions
  changeFillColor: (object: CanvasObject, color: string) => void;

  // Crop Actions
  applyCrop: () => void;
  setIsCropping: (isCropping: boolean) => void;

  // Crop-related state
  cropObject: fabric.Image | null;

  // Crop actions
  startCropping: (object: CanvasObject) => void;

  addText: (text: string, options?: Partial<fabric.ITextOptions>) => void;
}

export interface CanvasProviderProps {
  children: ReactNode;
}
