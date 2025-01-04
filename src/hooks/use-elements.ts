import { useCanvasContext } from "@/context/canvas-context";
import { createShape } from "@/lib/shapes";
import { useState, useCallback } from "react";
import { fabric } from "fabric";

export const useElements = () => {
  const { canvas } = useCanvasContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShapeAdd = useCallback(
    (type: string) => {
      if (!canvas) return;

      const shape = createShape({ canvas, type });
      if (shape) {
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.centerObject(shape);
        canvas.renderAll();
      }
    },
    [canvas]
  );

  const handleImageAdd = useCallback(
    (url: string) => {
      if (!canvas) return;

      fabric.Image.fromURL(url, (img) => {
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width!, maxSize / img.height!);

        img.set({
          scaleX: scale,
          scaleY: scale,
          // objectType: 'image',
          // id: `image_${Date.now()}`,
        });

        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });

      setIsDialogOpen(false);
    },
    [canvas]
  );

  const handleClearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.renderAll();
  }, [canvas]);

  return {
    handleShapeAdd,
    handleImageAdd,
    handleClearCanvas,
    isDialogOpen,
    setIsDialogOpen,
  };
};
