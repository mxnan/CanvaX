/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from "react";
import { fabric } from "fabric";
import { CanvasContextValue, CanvasProviderProps, CanvasObject, Position } from "./types";
import { createShape } from "@/lib/shapes";
import { Image } from "fabric/fabric-impl";

const CanvasContext = createContext<CanvasContextValue | undefined>(undefined);

export function CanvasProvider({ children }: CanvasProviderProps) {
  // Core State
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(null);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [objectCount, setObjectCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  // Utility Functions
  const incrementObjectCount = useCallback(() => {
    setObjectCount(prev => prev + 1);
  }, []);

  // Object Actions
  const addShape = useCallback((type: string) => {
    if (!canvas) return;
    
    const shape = createShape({ canvas, type });
    if (shape) {
      shape.set({
        objectType: "shape",
        id: `${type}_${Date.now()}`,
        selectable: true,
        hasControls: true,
      } as Partial<CanvasObject>);

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.centerObject(shape);
      canvas.requestRenderAll();
      setSelectedObject(shape as CanvasObject);
      incrementObjectCount();
    }
  }, [canvas, incrementObjectCount, setSelectedObject]);

  const addImage = useCallback((url: string) => {
    if (!canvas) return;

    fabric.Image.fromURL(url, (img) => {
      const maxSize = 300;
      const scale = Math.min(maxSize / img.width!, maxSize / img.height!);

      img.set({
        scaleX: scale,
        scaleY: scale,
        objectType: "image",
        id: `image_${Date.now()}`,
        selectable: true,
        hasControls: true,
      } as Partial<Image>);

      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      setSelectedObject(img as CanvasObject);
      incrementObjectCount();
    });

    setIsDialogOpen(false);
  }, [canvas, incrementObjectCount, setSelectedObject]);

  const deleteObject = useCallback((obj: CanvasObject) => {
    if (!canvas) return;
    canvas.remove(obj);
    setSelectedObject(null);
  }, [canvas]);

  const duplicateObject = useCallback((obj: CanvasObject) => {
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
  }, [canvas, incrementObjectCount]);

  // Transform Actions
  const moveObjectForward = useCallback((obj: CanvasObject) => {
    if (!canvas) return;
    obj.bringForward();
    canvas.renderAll();
  }, [canvas]);

  const moveObjectBackward = useCallback((obj: CanvasObject) => {
    if (!canvas) return;
    obj.sendBackwards();
    canvas.renderAll();
  }, [canvas]);

  // Style Actions
  const changeFillColor = useCallback((object: CanvasObject, color: string) => {
    if (!canvas || !object) return;
    object.set("fill", color);
    canvas.renderAll();
  }, [canvas]);

  // Canvas Actions
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    setSelectedObject(null);
  }, [canvas]);

  // Layer Actions
  const bringToFront = useCallback((obj: CanvasObject) => {
    if (!canvas) return;
    obj.bringToFront();
    canvas.renderAll();
  }, [canvas]);

  const sendToBack = useCallback((obj: CanvasObject) => {
    if (!canvas) return;
    obj.sendToBack();
    canvas.renderAll();
  }, [canvas]);

  // Transform Actions
  const rotateObject = useCallback((object: CanvasObject, angle: number) => {
    if (!canvas || !object) return;
    object.rotate!((object.angle || 0) + angle);
    canvas.renderAll();
  }, [canvas]);

  const flipObject = useCallback((object: CanvasObject, direction: "horizontal" | "vertical") => {
    if (!canvas || !object) return;
    if (direction === "horizontal") {
      object.set("flipX", !object.flipX);
    } else {
      object.set("flipY", !object.flipY);
    }
    canvas.renderAll();
  }, [canvas]);

  const resetObjectTransform = useCallback((object: CanvasObject) => {
    if (!canvas || !object) return;
    object.set({
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
    });
    canvas.renderAll();
  }, [canvas]);

  const updateObjectProperties = useCallback((object: CanvasObject, properties: Partial<CanvasObject>) => {
    if (!canvas || !object) return;
    object.set(properties);
    canvas.renderAll();
  }, [canvas]);

  // Image Actions
  const applyCrop = useCallback(() => {
    if (!canvas || !selectedObject) return;
    // Implement crop logic here
    setIsCropping(false);
  }, [canvas, selectedObject]);

  const value = {
    // State
    canvas,
    selectedObject,
    position,
    objectCount,
    isDialogOpen,
    isCropping,

    // Setters
    setCanvas,
    setSelectedObject,
    setIsDialogOpen,
    setIsCropping,
    incrementObjectCount,

    // Object Actions
    addShape,
    addImage,
    deleteObject,
    duplicateObject,
    clearCanvas,

    // Layer Actions
    moveObjectForward,
    moveObjectBackward,
    bringToFront,
    sendToBack,

    // Transform Actions
    rotateObject,
    flipObject,
    resetObjectTransform,
    updateObjectProperties,

    // Style Actions
    changeFillColor,

    // Crop Actions
    applyCrop,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};