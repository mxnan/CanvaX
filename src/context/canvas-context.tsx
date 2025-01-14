import { createContext, useContext, useState, useCallback } from "react";
import { fabric } from "fabric";
import {
  CanvasContextValue,
  CanvasProviderProps,
  CanvasObject,
} from "./types";
import { createShape } from "@/lib/shapes";
import { Image } from "fabric/fabric-impl";

const CanvasContext = createContext<CanvasContextValue | undefined>(undefined);

export function CanvasProvider({ children }: CanvasProviderProps) {
  // Core State
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(
    null
  );
  // const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [objectCount, setObjectCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [isCropping, setIsCropping] = useState(false);
  // const [cropObject, setCropObject] = useState<fabric.Image | null>(null);
  // const [cropArea, setCropArea] = useState<fabric.Rect | null>(null);

  // Utility Functions
  const incrementObjectCount = useCallback(() => {
    setObjectCount((prev) => prev + 1);
  }, []);

  // Object Actions
  const addShape = useCallback(
    (type: string) => {
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
        canvas.requestRenderAll();
        setSelectedObject(shape as CanvasObject);
        incrementObjectCount();
      }
    },
    [canvas, incrementObjectCount, setSelectedObject]
  );

  const addImage = useCallback(
    (url: string) => {
      if (!canvas) return;

      fabric.Image.fromURL(url, (img) => {
        // const maxSize = 300;
        // const scale = Math.min(maxSize / img.width!, maxSize / img.height!);

        img.set({
          // scaleX: scale,
          // scaleY: scale,
          objectType: "image",
          id: `image_${Date.now()}`,
          hasRotatingPoint: true,
          lockScalingFlip: true,
        } as Partial<Image>);

        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        setSelectedObject(img as CanvasObject);
        incrementObjectCount();
      });

      setIsDialogOpen(false);
    },
    [canvas, incrementObjectCount, setSelectedObject]
  );

  const addText = useCallback(
    (text: string, options?: Partial<CanvasObject>) => {
      if (!canvas) return;

      const textObject = new fabric.Textbox(text, {
        left: 150, // Default position
        top: 150, // Default position
        fontSize: 40, // Default font size
        fontWeight: 800, //Default font weight
        fontFamily: "Space Grotesk",
        textAlign: "center",
        fill: "#fff", // Default text color
        objectType: "text", // Set object type to 'text'
        id: `text_${Date.now()}`, // Unique ID
        ...options, // Merge any additional options
      });

      canvas.add(textObject);
      canvas.setActiveObject(textObject);
      canvas.requestRenderAll();
      setSelectedObject(textObject as CanvasObject);
      incrementObjectCount();
    },
    [canvas, incrementObjectCount, setSelectedObject]
  );

  const deleteObject = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      canvas.remove(obj);
      setSelectedObject(null);
    },
    [canvas]
  );

  const duplicateObject = useCallback(
    (obj: CanvasObject) => {
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
    [canvas, incrementObjectCount]
  );

  // Transform Actions
  const moveObjectForward = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.bringForward();
      canvas.renderAll();
    },
    [canvas]
  );

  const moveObjectBackward = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.sendBackwards();
      canvas.renderAll();
    },
    [canvas]
  );

  // Style Actions
  const changeFillColor = useCallback(
    (object: CanvasObject, color: string) => {
      if (!canvas || !object) return;
      object.set("fill", color);
      canvas.renderAll();
    },
    [canvas]
  );

  // Canvas Actions
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    setSelectedObject(null);
  }, [canvas]);

  // Layer Actions
  const bringToFront = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.bringToFront();
      canvas.renderAll();
    },
    [canvas]
  );

  const sendToBack = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.sendToBack();
      canvas.renderAll();
    },
    [canvas]
  );

  // Transform Actions
  const rotateObject = useCallback(
    (object: CanvasObject, angle: number) => {
      if (!canvas || !object) return;
      object.rotate!((object.angle || 0) + angle);
      canvas.renderAll();
    },
    [canvas]
  );

  const flipObject = useCallback(
    (object: CanvasObject, direction: "horizontal" | "vertical") => {
      if (!canvas || !object) return;
      if (direction === "horizontal") {
        object.set("flipX", !object.flipX);
      } else {
        object.set("flipY", !object.flipY);
      }
      canvas.renderAll();
    },
    [canvas]
  );

  const resetObjectTransform = useCallback(
    (object: CanvasObject) => {
      if (!canvas || !object) return;
      object.set({
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
      });
      canvas.renderAll();
    },
    [canvas]
  );

  const updateObjectProperties = useCallback(
    (object: CanvasObject, properties: Partial<CanvasObject>) => {
      if (!canvas || !object) return;
      object.set(properties);
      canvas.renderAll();
    },
    [canvas]
  );

  // // Image Actions
  // const startCropping = useCallback(
  //   (object: CanvasObject) => {
  //     if (!canvas || object.type !== "image") return;

  //     const image = object as fabric.Image;
  //     const cropArea = new fabric.Rect({
  //       left: image.left,
  //       top: image.top,
  //       width: image.width! * image.scaleX!,
  //       height: image.height! * image.scaleY!,
  //       fill: "#ff0000",
  //       opacity: 0.2,
  //       stroke: "#ff0000",
  //       strokeWidth: 2,
  //       strokeDashArray: [5, 5],
  //       cornerColor: "white",
  //       cornerSize: 10,
  //       // Disable rotation and keep only scaling/moving
  //       lockRotation: true,
  //       hasRotatingPoint: false,
  //       lockSkewingX: true,
  //       lockSkewingY: true,
  //       transparentCorners: false,
  //     });

  //     // Disable controls on the original image while cropping
  //     image.selectable = false;
  //     image.evented = false;

  //     canvas.add(cropArea);
  //     canvas.setActiveObject(cropArea);
  //     setCropObject(image);
  //     setCropArea(cropArea);
  //     setIsCropping(true);
  //     canvas.requestRenderAll();
  //   },
  //   [canvas]
  // );

  // const applyCrop = useCallback(() => {
  //   if (!canvas || !cropObject || !cropArea) return;

  //   const imageElement = cropObject.getElement();
  //   const cropBounds = cropArea.getBoundingRect();
  //   const imageBounds = cropObject.getBoundingRect();

  //   // Calculate the scale of the original image
  //   const originalScale = cropObject.scaleX!;

  //   const tempCanvas = document.createElement("canvas");
  //   const tempCtx = tempCanvas.getContext("2d")!;
  //   tempCanvas.width = cropBounds.width;
  //   tempCanvas.height = cropBounds.height;

  //   tempCtx.drawImage(
  //     imageElement,
  //     (cropBounds.left - imageBounds.left) / cropObject.scaleX!,
  //     (cropBounds.top - imageBounds.top) / cropObject.scaleY!,
  //     cropBounds.width / cropObject.scaleX!,
  //     cropBounds.height / cropObject.scaleY!,
  //     0,
  //     0,
  //     cropBounds.width,
  //     cropBounds.height
  //   );

  //   const dataUrl = tempCanvas.toDataURL(cropObject.type);
  //   fabric.Image.fromURL(dataUrl, (newImage) => {
  //     newImage.set({
  //       left: cropBounds.left,
  //       top: cropBounds.top,
  //       objectType: "image",
  //       id: `image_${Date.now()}`,
  //       selectable: true,
  //       evented: true,
  //       // Maintain the original image's scale
  //       scaleX: originalScale,
  //       scaleY: originalScale,
  //     } as Partial<Image>);

  //     canvas.add(newImage);
  //     canvas.setActiveObject(newImage);
  //     incrementObjectCount();

  //     // Re-enable the original image controls
  //     cropObject.selectable = true;
  //     cropObject.evented = true;

  //     canvas.remove(cropArea);
  //     setCropObject(null);
  //     setCropArea(null);
  //     setIsCropping(false);
  //     canvas.requestRenderAll();
  //   });
  // }, [canvas, cropObject, cropArea, incrementObjectCount]);

  const value = {
    // State
    canvas,
    selectedObject,
    // position,
    objectCount,
    isDialogOpen,
    // isCropping,
    // cropObject,

    // Setters
    setCanvas,
    setSelectedObject,
    setIsDialogOpen,
    // setIsCropping,
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
    // startCropping,
    // applyCrop,

    // Text Actions
    addText,
  };

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
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
