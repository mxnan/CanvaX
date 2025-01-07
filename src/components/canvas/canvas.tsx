import React from "react";
import { fabric } from "fabric";
import { useStore } from "@/store";
import { CanvasObject } from "@/store/slices/canvas-slice";

const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject } = useStore();

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
    });

    const updateSelectedObject = () => {
      const activeObject = canvas.getActiveObject() as CanvasObject;
      if (activeObject) {
        setSelectedObject(activeObject);
      }
    };

    canvas.on("selection:created", updateSelectedObject);
    canvas.on("selection:updated", updateSelectedObject);
    canvas.on("selection:cleared", () => setSelectedObject(null));
    
    // Add these event listeners
    canvas.on("object:moving", updateSelectedObject);
    canvas.on("object:scaling", updateSelectedObject);
    canvas.on("object:rotating", updateSelectedObject);
    canvas.on("mouse:wheel", updateSelectedObject);

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [setCanvas, setSelectedObject]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-neutral-900/20 rounded-lg shadow-xl"
    />
  );
};

export default Canvas;
