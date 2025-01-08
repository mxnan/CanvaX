import React from "react";
import { fabric } from "fabric";
import { useStore } from "@/store";
import { CanvasObject } from "@/store/types";
import { CropControls } from "../ui-helper/crop-controls";

const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject } = useStore();

  const initCanvas = () => {
    if (!canvasRef.current) return;
    return new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
      selection: false,
    });
  };

  const updateSelectedObject = React.useCallback((e: fabric.IEvent) => {
    const activeObject = e.target as CanvasObject;
    if (!activeObject?.id) return;

    setSelectedObject(activeObject);
  }, [setSelectedObject]);

  React.useEffect(() => {
    const canvas = initCanvas();
    if (!canvas) return;

    const events = [
      // "selection:created",
      // "selection:updated",
      "object:moving",
      // "object:scaling",
      // "object:rotating",
      // "mouse:wheel",
    ];

    events.forEach((name) => {
      canvas.on(name, updateSelectedObject);
    });

    setCanvas(canvas);

    // Error boundary for detecting render loops
    window.addEventListener("error", (e) => {
      if (e.message.includes("Maximum update depth exceeded")) {
        console.error("Render loop detected:", e);
      }
    });

    return () => {
      events.forEach((name) => {
        canvas.off(name, updateSelectedObject);
      });
      canvas.dispose();
      setCanvas(null);
      setSelectedObject(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvas, updateSelectedObject]);

  return (
    <>
      <canvas ref={canvasRef} className="bg-neutral-800/20 rounded-lg shadow-xl" />
      <CropControls />
    </>
  );
};

export default Canvas;
