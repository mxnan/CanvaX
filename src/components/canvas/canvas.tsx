import React from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/context/canvas-context";
import { CanvasObject } from "@/context/types";
import { CropControls } from "../ui-helper/crop-controls";

const Canvas = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject } = useCanvas();

  const initCanvas = React.useCallback(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
      preserveObjectStacking: true,
      selection: false,
      renderOnAddRemove: false,
      stopContextMenu: true,
    });

    fabricCanvas.setDimensions({
      width: window.innerWidth - 32,
      height: window.innerHeight - 32,
    });

    return fabricCanvas;
  }, []);

  // Improved selection handler
  const handleObjectSelection = React.useCallback((e: fabric.IEvent) => {
    // console.log("Selection event:", e.type, e.target);
    const target = e.target as CanvasObject | undefined;
    
    if (!target) {
      setSelectedObject(null);
      return;
    }

    // Ensure the object has required properties
    if (!target.id) {
      target.set('id', `object_${Date.now()}`);
    }
    if (!target.objectType) {
      target.set('objectType', 'shape');
    }

    setSelectedObject(target);
  }, [setSelectedObject]);

  React.useEffect(() => {
    const canvas = initCanvas();
    if (!canvas) return;

    setCanvas(canvas);

    // Selection events with debug logs
    const selectionEvents = [
      'selection:created',
      'selection:updated',
      'selection:cleared',
      'mouse:down',
    ];

    selectionEvents.forEach(eventName => {
      canvas.on(eventName, (e) => {
        console.log(`Canvas event: ${eventName}`);
        handleObjectSelection(e);
      });
    });

    // Modification events
    const modEvents = ['object:moving', 'object:scaling', 'object:rotating', 'object:modified'];
    modEvents.forEach(eventName => {
      canvas.on(eventName, (e) => {
        canvas.renderAll();
        // Ensure selection is maintained during modification
        if (e.target) {
          handleObjectSelection(e);
        }
      });
    });

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 32,
        height: window.innerHeight - 32,
      });
      canvas.requestRenderAll();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      selectionEvents.forEach(eventName => {
        canvas.off(eventName);
      });
      modEvents.forEach(eventName => {
        canvas.off(eventName);
      });
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      setSelectedObject(null);
      setCanvas(null);
    };
  }, [initCanvas, setCanvas, setSelectedObject, handleObjectSelection]);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="bg-neutral-800/20 rounded-lg shadow-xl"
      />
      <CropControls />
    </>
  );
};

export default React.memo(Canvas);
