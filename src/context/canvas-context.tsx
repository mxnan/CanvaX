import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { fabric } from "fabric";
import { ControlGroup } from "@/config/controls";

// Type Definitions
export interface CanvasObject extends fabric.Object {
  id?: string;
  zIndex?: number;
  objectType?: string;
}

export interface Position {
  top: number;
  left: number;
}

export interface CanvasContextType {
  canvas: fabric.Canvas | null;
  selectedObject: CanvasObject | null;
  position: Position;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setSelectedObject: (object: CanvasObject | null) => void;
  moveObjectForward: (obj: CanvasObject) => void;
  moveObjectBackward: (obj: CanvasObject) => void;
  deleteObject: (obj: CanvasObject) => void;
  duplicateObject: (obj: CanvasObject) => void;
}

// Control Type Definitions
export interface Control {
  id: string;
  icon?: React.ElementType;
  action: string;
  tooltip: string;
  className?: string;
  group: ControlGroup;
}

export interface ShapeTool {
  id: string;
  icon: React.ElementType;
  tooltip: string;
  type: "shape" | "text" | "image" | "action";
}

// Context Creation and Provider
const CanvasContext = createContext<CanvasContextType | null>(null);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(
    null
  );
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  // Update position when selected object changes or moves
  useEffect(() => {
    if (!canvas || !selectedObject) return;

    const updateControlsPosition = () => {
      const zoom = canvas.getZoom();
      const bounds = selectedObject.getBoundingRect();
      const offset = canvas.getElement().getBoundingClientRect();

      setPosition({
        top: bounds.top * zoom + offset.top,
        left: bounds.left * zoom + offset.left,
      });
    };

    // Update position initially
    updateControlsPosition();

    // Add event listeners for object modifications
    canvas.on("object:moving", updateControlsPosition);
    // canvas.on("object:scaling", updateControlsPosition);
    // canvas.on("object:rotating", updateControlsPosition);
    // canvas.on('mouse:wheel', updateControlsPosition);

    return () => {
      canvas.off("object:moving", updateControlsPosition);
      // canvas.off("object:scaling", updateControlsPosition);
      // canvas.off("object:rotating", updateControlsPosition);
      // canvas.off('mouse:wheel', updateControlsPosition);
    };
  }, [canvas, selectedObject]);

  const moveObjectForward = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.bringForward();
      canvas.renderAll();
    },
    [canvas]
  );

  const moveObjectBackward = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.sendBackwards();
      canvas.renderAll();
    },
    [canvas]
  );

  const deleteObject = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      canvas.remove(obj);
      setSelectedObject(null);
    },
    [canvas]
  );

  const duplicateObject = useCallback(
    (obj: CanvasObject) => {
      if (!canvas) return;
      obj.clone((cloned: fabric.Object) => {
        const newObj = cloned as CanvasObject;
        newObj.set({
          left: obj.left! + 20,
          top: obj.top! + 20,
          id: `object_${Date.now()}`,
          objectType: obj.objectType,
        });

        canvas.add(newObj);
        canvas.setActiveObject(newObj);
        canvas.renderAll();
      });
    },
    [canvas]
  );


  return (
    <CanvasContext.Provider
      value={{
        canvas,
        selectedObject,
        position,
        setCanvas,
        setSelectedObject,
        moveObjectForward,
        moveObjectBackward,
        deleteObject,
        duplicateObject,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
