import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControlButton } from "./control-button";
import { Control } from "@/config/controls";
import { Button } from "../ui/button";

interface ColorPickerProps {
  control: Control;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ control, onColorChange }: ColorPickerProps) {
  const defaultColors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#808080",
    "#800000",
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <ControlButton control={control} onClick={() => {}} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-neutral-900/90 backdrop-blur-sm border-neutral-800"
        side="bottom"
        sideOffset={16}
      >
        <div className="grid grid-cols-5 gap-1 p-2">
          {defaultColors.map((color) => (
            <Button
              variant={"secondary"}
              size={"icon"}
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
          <input
            type="color"
            className="w-8 h-8 rounded-md cursor-pointer"
            onChange={(e) => onColorChange(e.target.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
