import React from "react";

import { Laptop, Smartphone, TabletSmartphone, Wallpaper } from "lucide-react";
import { Button } from "@/components/ui/button";
interface CanvasSettingsProps {
  canvas: fabric.Canvas | null;
}

function CanvasSettings({ canvas }: CanvasSettingsProps) {
  const [canvasHeight, setCanvasHeight] = React.useState<number>(500);
  const [canvasWidth, setCanvasWidth] = React.useState<number>(500);

  React.useEffect(() => {
    if (canvas) {
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvasHeight, canvasWidth, canvas]);

  const setCanvasSize = (width: string, height: string) => {
    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);

    if (!isNaN(parsedWidth) && !isNaN(parsedHeight)) {
      setCanvasWidth(parsedWidth);
      setCanvasHeight(parsedHeight);
    }
  };

  return (
    <div className="fixed z-[3] top-2 left-1/2 -translate-x-1/2">
      <div className="flex flex-wrap gap-3 *:text-lg text-black font-light">
        <Button
          variant={"secondary"}
          size={"icon"}
          onClick={() => setCanvasSize("960", "540")}
        >
          <Wallpaper />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => setCanvasSize("360", "640")}
        >
          <Smartphone />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => setCanvasSize("800", "600")}
        >
          <Laptop />
        </Button>
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => setCanvasSize("500", "500")}
        >
          <TabletSmartphone />
        </Button>
      </div>
    </div>
  );
}

export default CanvasSettings;
