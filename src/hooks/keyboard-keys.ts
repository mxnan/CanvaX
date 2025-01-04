import { useCanvasContext } from '@/context/canvas-context';
import { useEffect } from 'react';


export const useKeyboardShortcuts = () => {
  const { canvas, selectedObject, deleteObject } = useCanvasContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas || !selectedObject) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          deleteObject(selectedObject);
          break;
        case 'PageUp':
          selectedObject.bringToFront();
          canvas.renderAll();
          break;
        case 'PageDown':
          selectedObject.sendToBack();
          canvas.renderAll();
          break;
        // Add more shortcuts as needed
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canvas, selectedObject, deleteObject]);
};