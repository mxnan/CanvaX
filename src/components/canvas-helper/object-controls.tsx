import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getObjectControls } from "@/config/controls";
import { ControlButton } from "@/components/ui-helper/control-button";
import { useStore } from "@/store";

const ObjectControls = () => {
  const {
    selectedObject,
    position,
    handleObjectAction
  } = useStore();

  if (!selectedObject) return null;

  const controls = getObjectControls(selectedObject.objectType || "shape");
  console.log(selectedObject.type)

  const handleAction = (action: string) => {
    handleObjectAction(action, selectedObject);
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
        <div className="flex gap-1 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-1.5 shadow-lg border border-neutral-800">
          {Object.entries(groupedControls).map(([group, groupControls]) => (
            <React.Fragment key={group}>
              <div className="flex gap-1">
                {groupControls.map((control) => (
                  <ControlButton
                    key={control.id}
                    control={control}
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

export default ObjectControls;
