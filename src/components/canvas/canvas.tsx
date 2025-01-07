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
      // Disable multi-selection/grouping
      selection: false,         // Disables group selection
    });

    const updateSelectedObject = () => {
      const activeObject = canvas.getActiveObject() as CanvasObject;
      if (activeObject) {
        setSelectedObject(activeObject);
      }
    };

    // Define all events to listen to
    const events = [
      { name: "selection:created", handler: updateSelectedObject },
      { name: "selection:updated", handler: updateSelectedObject },
      { name: "selection:cleared", handler: () => setSelectedObject(null) },
      { name: "object:moving", handler: updateSelectedObject },
      { name: "object:scaling", handler: updateSelectedObject },
      { name: "object:rotating", handler: updateSelectedObject },
      { name: "mouse:wheel", handler: updateSelectedObject },
    ] as const;

    // Add all event listeners
    events.forEach(({ name, handler }) => {
      canvas.on(name, handler);
    });

    // Set canvas in store
    setCanvas(canvas);

    // Cleanup function
    return () => {
      // Remove all event listeners
      events.forEach(({ name, handler }) => {
        canvas.off(name, handler);
      });
      
      // Dispose of canvas
      canvas.dispose();
      
      // Clear canvas from store
      setCanvas(null);
      setSelectedObject(null);
    };
  }, [setCanvas, setSelectedObject]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-neutral-800/20 rounded-lg shadow-xl"
    />
  );
};

export default Canvas;
