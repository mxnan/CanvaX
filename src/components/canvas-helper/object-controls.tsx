import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getObjectControls } from "@/config/controls";
import { useCanvas } from "@/context/canvas-context";
import { ControlAction } from "@/config/controls";
import ColorPicker from "../ui-helper/color-picker";
import ControlButton from "../ui-helper/control-button";

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
    // startCropping,
  } = useCanvas();

  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Debug log for component updates
  React.useEffect(() => {
    console.log("object type:", selectedObject?.objectType);
  }, [selectedObject]);

  const updatePosition = React.useCallback(() => {
    if (!selectedObject || !canvas) return;

    const canvasElement = canvas.getElement();
    if (!canvasElement) return;

    const zoom = canvas.getZoom();
    const bounds = selectedObject.getBoundingRect();
    const offset = canvasElement.getBoundingClientRect();

    setPosition({
      top: bounds.top * zoom + offset.top - 10,
      left: bounds.left * zoom + offset.left,
    });
  }, [selectedObject, canvas]);

  // Update position when selected object changes or during modifications
  React.useEffect(() => {
    if (!canvas || !selectedObject) return;

    const updatePositionAndRender = () => {
      updatePosition(); // Update position
      canvas.requestRenderAll(); // Request a render to update controls
    };

    const events = [
      "selection:created",
      "selection:updated",
      "selection:cleared",
      "object:moving",
      "object:scaling",
      "object:rotating",
      "object:modified",
    ];

    // Initial position update
    updatePositionAndRender();

    events.forEach((event) => canvas.on(event, updatePositionAndRender));
    return () => events.forEach((event) => canvas.off(event, updatePositionAndRender));
  }, [canvas, selectedObject, updatePosition]);

  // // Update position when selected object changes
  // React.useEffect(() => {
  //   if (selectedObject && canvas) {
  //     updatePosition(); // Update position immediately on selection
  //     canvas.requestRenderAll(); // Request a render to update controls
  //   }
  // }, [selectedObject, canvas, updatePosition]);

  // // Listen to canvas events
  // React.useEffect(() => {
  //   if (!canvas || !selectedObject) return;

  //   const events = [
  //     "object:moving",
  //     "object:scaling",
  //     "object:rotating",
  //     "object:modified",
  //     "selection:created",
  //     "selection:updated",
  //     "selection:cleared",
  //   ];

  //   events.forEach((event) => {
  //     canvas.on(event, updatePosition);
  //   });

  //   return () => {
  //     events.forEach((event) => {
  //       canvas.off(event, updatePosition);
  //     });
  //   };
  // }, [canvas, selectedObject, updatePosition]);

  // Debug render
  // console.log("ObjectControls render:", { selectedObject, position });

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
          // case "cropImage":
          //   if (selectedObject.objectType === "image") {
          //     // startCropping(selectedObject);
          //   }
          //   break;
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
      // startCropping,
    ]
  );

  if (!selectedObject || !canvas) {
   
    return null;
  }

  const controls = getObjectControls(selectedObject.objectType || "shape");

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={selectedObject.id} // Add key for proper animation
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
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
                {groupControls.map((control) => {
                  if (control.action === "changeFill") {
                    return (
                      <ColorPicker
                        key={control.id}
                        control={control}
                        onColorChange={(color: string) =>
                          handleAction("changeFill", { color })
                        }
                      />
                    );
                  }
                  return (
                    <ControlButton
                      key={control.id}
                      control={control}
                      onClick={() => handleAction(control.action)}
                    />
                  );
                })}
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
