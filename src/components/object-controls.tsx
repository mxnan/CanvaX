import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { objectControls } from "@/config/controls";
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

  const handleAction = (action: string) => {
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
      // Add other actions as needed
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
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
          {objectControls.map((control) => (
            <React.Fragment key={control.id}>
              <ControlButton
                control={control}
                isLocked={isLocked}
                onClick={() => handleAction(control.action)}
              />
              {/* {control.id === 'flipV' && (
                <div className="w-px h-full bg-neutral-800" />
              )} */}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
