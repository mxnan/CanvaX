import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getObjectControls } from "@/config/controls";
import { ControlButton } from "@/components/ui-helper/control-button";
import { useCanvas } from "@/context/canvas-context";
import { ColorPicker } from "@/components/ui-helper/color-picker";
import { ControlAction } from "@/config/controls";

const ObjectControls = () => {
  const {
    selectedObject,
    canvas,
    deleteObject,
    duplicateObject,
    changeFillColor,
    moveObjectForward,
    moveObjectBackward,
    rotateObject,
    flipObject,
    resetObjectTransform,
    setIsCropping,
  } = useCanvas();

  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Debug log for component updates
  React.useEffect(() => {
    console.log("ObjectControls selectedObject changed:", selectedObject);
  }, [selectedObject]);

  const updatePosition = React.useCallback(() => {
    if (!selectedObject || !canvas) {
      console.log("Cannot update position - missing object or canvas");
      return;
    }

    try {
      const canvasElement = canvas.getElement();
      if (!canvasElement) return;

      const zoom = canvas.getZoom();
      const bounds = selectedObject.getBoundingRect();
      const offset = canvasElement.getBoundingClientRect();

      const newPosition = {
        top: bounds.top * zoom + offset.top - 10,
        left: bounds.left * zoom + offset.left,
      };

      console.log("New position calculated:", newPosition); // Debug log
      setPosition(newPosition);
    } catch (error) {
      console.error('Position update error:', error);
    }
  }, [selectedObject, canvas]);

  // Update position when selected object changes
  React.useEffect(() => {
    if (selectedObject && canvas) {
      console.log("Updating position for new selection"); // Debug log
      updatePosition();
    }
  }, [selectedObject, canvas, updatePosition]);

  // Listen to canvas events
  React.useEffect(() => {
    if (!canvas || !selectedObject) return;

    const events = [
      'object:moving',
      'object:scaling',
      'object:rotating',
      'object:modified',
      'selection:created',
      'selection:updated',
      'after:render',
    ];

    events.forEach(event => {
      canvas.on(event, updatePosition);
    });

    return () => {
      events.forEach(event => {
        canvas.off(event, updatePosition);
      });
    };
  }, [canvas, selectedObject, updatePosition]);

  // Debug render
  console.log("ObjectControls render:", { selectedObject, position });

  const handleAction = React.useCallback(
    (action: ControlAction, options?: Record<string, unknown>) => {
      if (!selectedObject || !canvas) return;

      try {
        switch (action) {
          case "delete":
            deleteObject(selectedObject);
            break;
          case "duplicate":
            duplicateObject(selectedObject);
            break;
          case "changeFill":
            if (options?.color && selectedObject.objectType !== "image") {
              changeFillColor(selectedObject, options.color as string);
            }
            break;
          case "moveForward":
            moveObjectForward(selectedObject);
            break;
          case "moveBackward":
            moveObjectBackward(selectedObject);
            break;
          case "rotate":
            rotateObject(selectedObject, 90);
            break;
          case "flipHorizontal":
            flipObject(selectedObject, "horizontal");
            break;
          case "flipVertical":
            flipObject(selectedObject, "vertical");
            break;
          case "resetImage":
            resetObjectTransform(selectedObject);
            break;
          case "cropImage":
            if (selectedObject.objectType === "image") {
              setIsCropping(true);
            }
            break;
        }
      } catch (error) {
        console.error(`Error handling action ${action}:`, error);
      }
    },
    [
      canvas,
      selectedObject,
      deleteObject,
      duplicateObject,
      changeFillColor,
      moveObjectForward,
      moveObjectBackward,
      rotateObject,
      flipObject,
      resetObjectTransform,
      setIsCropping,
    ]
  );

  if (!selectedObject || !canvas) {
    console.log("ObjectControls not rendering - no selection or canvas");
    return null;
  }

  const controls = getObjectControls(selectedObject.objectType || "shape");

  return (
    <AnimatePresence >
      <motion.div
        key={selectedObject.id} // Add key for proper animation
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9999] pointer-events-auto"
        style={{
          top: position.top - 90,
          left: position.left,
          // transform: 'translateY(-100%)',
        }}
      >
        <div className="flex gap-1 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-1.5 shadow-lg border border-neutral-800">
          {Object.entries(
            controls.reduce((acc, control) => {
              const group = control.group || "other";
              if (!acc[group]) acc[group] = [];
              acc[group].push(control);
              return acc;
            }, {} as Record<string, typeof controls>)
          ).map(([group, groupControls]) => (
            <React.Fragment key={group}>
              <div className="flex gap-1">
                {groupControls.map((control) =>
                  control.action === "changeFill" ? (
                    <ColorPicker
                      key={control.id}
                      control={control}
                      onColorChange={(color) =>
                        handleAction("changeFill", { color })
                      }
                    />
                  ) : (
                    <ControlButton
                      key={control.id}
                      control={control}
                      onClick={() => handleAction(control.action)}
                    />
                  )
                )}
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

export default React.memo(ObjectControls);
