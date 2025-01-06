import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SHAPE_TOOLS } from "@/config/shapes";
import { Square } from "lucide-react";

interface ShapesPopoverProps {
  onShapeAdd: (type: string) => void;
}

export const ShapesPopover = ({ onShapeAdd }: ShapesPopoverProps) => {
  const shapeTools = SHAPE_TOOLS.filter((tool) => tool.type === "shape");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative group hover:bg-neutral-800"
        >
          <Square />
          <span
            className="absolute left-full ml-2 px-2 py-1 bg-black/90 
                         text-white text-sm rounded-md invisible group-hover:visible 
                         whitespace-nowrap backdrop-blur-sm"
          >
            Add Shape
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={16}
        className="w-auto p-2 bg-neutral-900/90 backdrop-blur-sm 
                   border-neutral-800 flex flex-col gap-2"
      >
        {shapeTools.map((tool) => (
          <Button
            key={tool.id}
            size="icon"
            variant="secondary"
            onClick={() => onShapeAdd(tool.id)}
            className="relative group "
          >
            <tool.icon />
            {/* <span
              className="absolute left-full ml-2 px-2 py-1 bg-black/90 
                           text-white text-sm rounded-md invisible group-hover:visible 
                           whitespace-nowrap backdrop-blur-sm"
            >
              {tool.tooltip}
            </span> */}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
