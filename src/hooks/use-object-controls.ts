import { useCanvasContext } from "@/context/canvas-context";
import { useCallback } from "react";

export const useObjectControls = () => {
  const {
    canvas,
    selectedObject,
    moveObjectForward,
    moveObjectBackward,
    deleteObject,
    duplicateObject,
  } = useCanvasContext();

  const handleAction = useCallback(
    (action: string) => {
      if (!selectedObject || !canvas) return;

      switch (action) {
        // Transform group
        case "duplicate":
          duplicateObject(selectedObject);
          break;

        case "rotate":
          selectedObject.rotate((selectedObject.angle || 0) + 90);
          break;

        // Layer group
        case "moveForward":
          moveObjectForward(selectedObject);
          break;

        case "moveBackward":
          moveObjectBackward(selectedObject);
          break;

        case "bringToFront":
          selectedObject.bringToFront();
          break;

        case "sendToBack":
          selectedObject.sendToBack();
          break;

        // Transform group
        case "flipHorizontal":
          selectedObject.set("flipX", !selectedObject.flipX);
          break;

        case "flipVertical":
          selectedObject.set("flipY", !selectedObject.flipY);
          break;

        // Style group
        case "changeFill":
          // selectedObject.set({ fill: fillColor }); // Set the fill color
          break;

        // Text group
        case "editText":
          if (selectedObject.type === "text") {
            // Implement text editing
          }
          break;

        case "toggleAlign":
          if (selectedObject.type === "text") {
            // Implement text alignment
          }
          break;

        // Image group
        case "cropImage":
          if (selectedObject.type === "image") {
            // Implement image cropping
          }
          break;

        case "resetImage":
          if (selectedObject.type === "image") {
            selectedObject.set({
              scaleX: 1,
              scaleY: 1,
              angle: 0,
              flipX: false,
              flipY: false,
            });
          }
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
      moveObjectForward,
      moveObjectBackward,
      deleteObject,
      duplicateObject,
    ]
  );

  return {
    selectedObject,
    handleAction,
  };
};
