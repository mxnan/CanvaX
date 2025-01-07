import React from "react";
import { fabric } from "fabric";
import { CanvasObject } from "@/context/canvas-context";
import { useStore } from "@/store";

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
