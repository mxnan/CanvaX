import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control } from "@/config/controls";
import { Button } from "../ui/button";
import ControlButton from "../ui-helper/control-button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Italic,
  // Underline,
} from "lucide-react";
import { useState } from "react";

interface TextOptionsProps {
  control: Control;
  onTextOptionChange: (
    option: string,
    value: string | number | boolean
  ) => void;
}

const TextOptions = ({ control, onTextOptionChange }: TextOptionsProps) => {
  const [fontWeight, setFontWeight] = useState("500");
  const [isItalic, setIsItalic] = useState(false);
  // const [isUnderlined, setIsUnderlined] = useState(false);

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40];
  const fontFamilies = [
    "Space Grotesk",
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];

  const handleFontWeightChange = (weight: string) => {
    setFontWeight(weight);
    onTextOptionChange("fontWeight", weight);
  };

  const toggleItalic = () => {
    setIsItalic((prev) => !prev);
    onTextOptionChange("fontStyle", isItalic ? "normal" : "italic");
  };

  // const toggleUnderline = () => {
  //   setIsUnderlined((prev) => !prev);
  //   onTextOptionChange("underline", isUnderlined ? "underline" : "");
  // };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <ControlButton control={control} onClick={() => {}} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[240px] z-[9999] p-3 bg-neutral-900/90 backdrop-blur-sm border-neutral-800"
        side="right"
        sideOffset={16}
      >
        <div className="space-y-3">
          {/* Font Family Selector */}
          <select
            className="w-full p-1 text-sm rounded-md bg-neutral-800 border border-neutral-500"
            onChange={(e) => onTextOptionChange("fontFamily", e.target.value)}
          >
            {fontFamilies.map((font) => (
              <option style={{ fontFamily: font }} key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          {/* Font Size Grid */}
          <div className="grid grid-cols-5 gap-1">
            {fontSizes.map((size) => (
              <Button
                key={size}
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => onTextOptionChange("fontSize", size)}
              >
                {size}
              </Button>
            ))}
          </div>
          {/* Text Style Options */}
          <div className="grid grid-cols-5 gap-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onTextOptionChange("textAlign", "left")}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onTextOptionChange("textAlign", "center")}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onTextOptionChange("textAlign", "right")}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant={isItalic ? "default" : "secondary"}
              size="icon"
              onClick={toggleItalic}
            >
              <Italic className="w-4 h-4" />
            </Button>
            {/* <Button
              variant={isUnderlined ? "default" : "secondary"}
              size="icon"
              onClick={toggleUnderline}
            >
              <Underline className="w-4 h-4" />
            </Button> */}
          </div>

          {/* Font Weight Options */}
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant={fontWeight === "300" ? "default" : "secondary"}
              style={{ fontWeight: fontWeight }}
              className="text-sm"
              onClick={() => handleFontWeightChange("300")}
            >
              light
            </Button>
            <Button
              variant={fontWeight === "500" ? "default" : "secondary"}
              style={{ fontWeight: fontWeight }}
              className="text-sm"
              onClick={() => handleFontWeightChange("500")}
            >
              medium
            </Button>
            <Button
              variant={fontWeight === "800" ? "default" : "secondary"}
              style={{ fontWeight: fontWeight }}
              className="text-sm"
              onClick={() => handleFontWeightChange("800")}
            >
              bold
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TextOptions;
