import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useCanvasContext } from "@/context/canvas-context";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject } = useCanvasContext();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize canvas with proper dimensions
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 32, // Adjust padding as needed
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
    });

    // Add these event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Set canvas in context
    setCanvas(canvas);

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, [setCanvas, setSelectedObject]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-neutral-700/20 rounded-lg shadow-xl"
    />
  );
};
