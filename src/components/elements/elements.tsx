import React from "react";
import { Button } from "@/components/ui/button";

import { Image, Trash2 } from "lucide-react";

import { useCanvas } from "@/context/canvas-context";
import { toast } from "sonner";
import ImageUpload from "../canvas-helper/image-upload";
import ShapesPopover from "./shapes-popover";

const Elements = () => {
  const {
    addShape,
    addImage,
    clearCanvas,
    isDialogOpen,
    setIsDialogOpen,
    canvas,
    objectCount
  } = useCanvas();

  const handleClearCanvas = React.useCallback(() => {
    if (canvas && objectCount > 0) {
      clearCanvas();
      toast.success("Canvas cleared");
    }
  }, [canvas, clearCanvas, objectCount]);

  const handleAddImage = React.useCallback((url: string) => {
    addImage(url);
    toast.success("Image added");
  }, [addImage]);

  const handleAddShape = React.useCallback((type: string) => {
    addShape(type);
    toast.success(`${type} shape added`);
  }, [addShape]);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 z-[3]">
      <div className="flex flex-col bg-neutral-900/90 backdrop-blur-sm p-2 rounded-xl gap-3 border border-neutral-800">
        <ShapesPopover onShapeAdd={handleAddShape} />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsDialogOpen(true)}
          className="relative group hover:bg-neutral-800"
        >
          <Image className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-sm rounded-md invisible group-hover:visible whitespace-nowrap backdrop-blur-sm">
            Add Image
          </span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleClearCanvas}
          disabled={!canvas || objectCount === 0}
          className="relative group hover:bg-neutral-800 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-sm rounded-md invisible group-hover:visible whitespace-nowrap backdrop-blur-sm">
            Clear Canvas
          </span>
        </Button>
      </div>

      <ImageUpload
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onImageAdd={handleAddImage}
      />
    </div>
  );
};

export default React.memo(Elements);