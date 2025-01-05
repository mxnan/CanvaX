import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getObjectControls } from "@/config/controls";
import { ControlButton } from "./control-button";
import { useCanvasContext } from "@/context/canvas-context";

export const ObjectControls = () => {
  const {
    selectedObject,
    position,
    isLocked,
    moveObjectForward,
    moveObjectBackward,
    deleteObject,
    duplicateObject,
    toggleLock,
  } = useCanvasContext();

  if (!selectedObject) return null;

  const controls = getObjectControls(selectedObject.objectType || "shape");

  const handleAction = (action: string) => {
    if (!selectedObject) return;

    const objectType = selectedObject.objectType || "shape";

    // Handle shared controls
    switch (action) {
      case "toggleLock":
        toggleLock();
        break;
      case "duplicate":
        duplicateObject(selectedObject);
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

    // Handle type-specific controls
    if (objectType === "shape") {
      switch (action) {
        case "rotate":
          selectedObject.rotate!((selectedObject.angle || 0) + 90);
          break;
        case "flipHorizontal":
          selectedObject.set("flipX", !selectedObject.flipX);
          break;
        case "flipVertical":
          selectedObject.set("flipY", !selectedObject.flipY);
          break;
        case "changeFill":
          // Implement color picker
          break;
      }
    } else if (objectType === "image") {
      switch (action) {
        case "cropImage":
          // Implement image cropping
          break;
        case "resetImage":
          selectedObject.set({
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
          });
          break;
      }
    } else if (objectType === "text") {
      switch (action) {
        case "editText":
          // Implement text editing
          break;
        case "toggleAlign":
          // Implement text alignment
          break;
      }
    }
  };

  // Group controls by their group property
  const groupedControls = controls.reduce((acc, control) => {
    const group = control.group || "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(control);
    return acc;
  }, {} as Record<string, typeof controls>);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50 pointer-events-auto"
        style={{
          top: Math.max(0, position.top - 100),
          left: position.left,
        }}
      >
        <div
          className="flex gap-1 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-1.5 
                       shadow-lg border border-neutral-800"
        >
          {Object.entries(groupedControls).map(([group, groupControls]) => (
            <React.Fragment key={group}>
              <div className="flex gap-1">
                {groupControls.map((control) => (
                  <ControlButton
                    key={control.id}
                    control={control}
                    isLocked={isLocked}
                    onClick={() => handleAction(control.action)}
                  />
                ))}
              </div>
              {group !== "delete" && (
                <div className="w-px h-full bg-neutral-800" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
