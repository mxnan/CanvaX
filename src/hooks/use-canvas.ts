import { useCallback, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { CanvasObject } from '@/context/canvas-context';



export const useCanvas = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const objectCountRef = useRef(0);

  const initCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      preserveObjectStacking: true,
      // backgroundColor: '#ffffff',
    });

    fabricCanvas.on('object:added', (e) => {
      const obj = e.target as CanvasObject;
      if (obj) {
        const newId = `object_${Date.now()}_${objectCountRef.current}`;
        const newZIndex = objectCountRef.current + 1;
        
        obj.set({
          id: newId,
          zIndex: newZIndex,
          // borderColor: "#2196F3",
          // cornerColor: "#2196F3",
          // cornerSize: 8,
          // transparentCorners: false,
          // padding: 10,
        });

        if (!obj.left || !obj.top) {
          fabricCanvas.centerObject(obj);
        }

        objectCountRef.current += 1;
        fabricCanvas.renderAll();
      }
    });

    setCanvas(fabricCanvas);
    return fabricCanvas;
  }, []);


  const updateCanvasSize = useCallback(() => {
    if (!canvas) return;
    
    const padding = 32;
    canvas.setDimensions({
      width: window.innerWidth - padding,
      height: window.innerHeight - padding,
    });
    canvas.renderAll();
  }, [canvas]);

  return {
    canvas,
    initCanvas,
    updateCanvasSize,
    objectCount: objectCountRef.current,
  };
};