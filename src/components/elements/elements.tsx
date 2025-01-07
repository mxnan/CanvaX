import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/canvas-helper/image-upload";
import { Image, Trash2 } from "lucide-react";
import { ShapesPopover } from "./shapes-popover";
import { useStore } from "@/store";

const Elements = () => {
  const {
    addShape,
    addImage,
    clearCanvas,
    isDialogOpen,
    setIsDialogOpen
  } = useStore();

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 z-[3]">
      <div className="flex flex-col bg-neutral-900/90 backdrop-blur-sm p-2 rounded-xl gap-3 border border-neutral-800">
        <ShapesPopover onShapeAdd={addShape} />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsDialogOpen(true)}
          className="relative group hover:bg-neutral-800"
        >
          <Image />
          <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-sm rounded-md invisible group-hover:visible whitespace-nowrap backdrop-blur-sm">
            Add Image
          </span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={clearCanvas}
          className="relative group hover:bg-neutral-800"
        >
          <Trash2 />
          <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-sm rounded-md invisible group-hover:visible whitespace-nowrap backdrop-blur-sm">
            Clear Canvas
          </span>
        </Button>
      </div>

      <ImageUpload
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onImageAdd={addImage}
      />
    </div>
  );
};

export default Elements;