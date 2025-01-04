import { useCanvasContext } from "@/context/canvas-context";
import { useCallback, useState } from "react";

export const useObjectControls = () => {
  const {
    canvas,
    selectedObject,
    moveObjectForward,
    moveObjectBackward,
    deleteObject,
    duplicateObject,
  } = useCanvasContext();

  const [isLocked, setIsLocked] = useState(false);

  const handleAction = useCallback(
    (action: string) => {
      if (!selectedObject || !canvas) return;

      switch (action) {
        case "toggleLock":
          {
            const newLockState = !isLocked;
            selectedObject.set({
              lockMovementX: newLockState,
              lockMovementY: newLockState,
              lockRotation: newLockState,
              lockScalingX: newLockState,
              lockScalingY: newLockState,
            });
            setIsLocked(newLockState);
          }
          break;

        case "duplicate":
          duplicateObject(selectedObject);
          break;

        case "rotate":
          selectedObject.rotate((selectedObject.angle || 0) - 90);
          break;

        case "flipHorizontal":
          selectedObject.set("flipX", !selectedObject.flipX);
          break;

        case "flipVertical":
          selectedObject.set("flipY", !selectedObject.flipY);
          break;

        case "moveForward":
          moveObjectForward(selectedObject);
          break;

        case "moveBackward":
          moveObjectBackward(selectedObject);
          break;

        case "delete":
          deleteObject(selectedObject);
          break;
      }

      canvas.renderAll();
    },
    [
      canvas,
      selectedObject,
      isLocked,
      moveObjectForward,
      moveObjectBackward,
      deleteObject,
      duplicateObject,
    ]
  );

  return {
    selectedObject,
    isLocked,
    handleAction,
  };
};
