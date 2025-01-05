import React from "react";
import { fabric } from "fabric";
import { CanvasObject, useCanvasContext } from "@/context/canvas-context";

export const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject } = useCanvasContext();

  React.useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize canvas with proper dimensions
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 32, // Adjust padding as needed
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
    });
    // Set up selection events
    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0] as CanvasObject;
      setSelectedObject(obj || null);
    });

    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0] as CanvasObject;
      setSelectedObject(obj || null);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    setCanvas(canvas);

    // Cleanup
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
