import { Button } from "@/components/ui/button";
import { SHAPE_TOOLS } from "@/config/shapes";
import { useElements } from "@/hooks/use-elements";
import { ImageUpload } from "@/components/canvas-helper/image-upload";

export const Elements = () => {
  const {
    handleShapeAdd,
    handleImageAdd,
    handleClearCanvas,
    isDialogOpen,
    setIsDialogOpen,
  } = useElements();

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 z-[3]">
      <div
        className="flex flex-col bg-neutral-900/90 backdrop-blur-sm p-2 
                     rounded-xl gap-3 border border-neutral-800"
      >
        {SHAPE_TOOLS.map((tool) => (
          <Button
            key={tool.id}
            size="icon"
            variant="ghost"
            onClick={() => {
              switch (tool.type) {
                case "shape":
                  handleShapeAdd(tool.id);
                  break;
                // case "text":
                //   handleShapeAdd(tool.id);
                //   break;
                case "image":
                  setIsDialogOpen(true);
                  break;
                case "action":
                  handleClearCanvas();
                  break;
              }
            }}
            className="relative group hover:bg-neutral-800"
          >
            <tool.icon />
            <span
              className="absolute left-full ml-2 px-2 py-1 bg-black/90 
                           text-white text-sm rounded-md invisible group-hover:visible 
                           whitespace-nowrap backdrop-blur-sm"
            >
              {tool.tooltip}
            </span>
          </Button>
        ))}
      </div>

      <ImageUpload
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onImageAdd={handleImageAdd}
      />
    </div>
  );
};
