import React from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/context/canvas-context";
import { CanvasObject } from "@/context/types";
// import CropControls from "../ui-helper/crop-controls";

const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject } = useCanvas();

  const initCanvas = React.useCallback(() => {
    if (!canvasRef.current) return;
    // Set default control properties for all objects
    fabric.Object.prototype.set({
      borderColor: "#4B9CFF",
      borderScaleFactor: 2,
      padding: 12,
      borderOpacityWhenMoving: 0.3,
      cornerStyle: "circle",
      cornerColor: "#84cc16",
      cornerStrokeColor: "#22c55e",
      cornerSize: 12,
      transparentCorners: false,
      hasRotatingPoint: true,
      lockScalingFlip: true,
    });

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
      selection: false,
      renderOnAddRemove: true,
      stopContextMenu: true,
    });

    fabricCanvas.setDimensions({
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
    });

    return fabricCanvas;
  }, []);

  const handleObjectSelection = React.useCallback(
    (e: fabric.IEvent) => {
      const target = e.target as CanvasObject | undefined;

      if (!target) {
        setSelectedObject(null);
        return;
      }

      if (!target.id) target.set("id", `object_${Date.now()}`);
      if (!target.objectType) target.set("objectType", "shape");

      setSelectedObject(target);
    },
    [setSelectedObject]
  );

  React.useEffect(() => {
    const canvas = initCanvas();
    if (!canvas) return;

    setCanvas(canvas);

    const events = {
      selection: [
        "selection:created",
        "selection:updated",
        "selection:cleared",
      ],
      modification: [
        "object:moving",
        "object:scaling",
        "object:rotating",
        "object:modified",
      ],
    };

    events.selection.forEach((eventName) => {
      canvas.on(eventName, handleObjectSelection);
    });

    events.modification.forEach((eventName) => {
      canvas.on(eventName, (e) => {
        canvas.requestRenderAll();
        if (e.target) handleObjectSelection(e);
      });
    });

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 32,
        height: window.innerHeight - 32,
      });
      canvas.requestRenderAll();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      [...events.selection, ...events.modification].forEach((eventName) => {
        canvas.off(eventName);
      });
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
      setSelectedObject(null);
      setCanvas(null);
    };
  }, [initCanvas, setCanvas, setSelectedObject, handleObjectSelection]);

  return (
    <>
      <canvas ref={canvasRef} className="bg-transparent rounded-lg shadow-xl" />
      {/* <CropControls /> */}
    </>
  );
};

export default React.memo(Canvas);
