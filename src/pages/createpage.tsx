import React from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Circle, RectangleHorizontal } from "lucide-react";
import Settings from "@/components/settings";
export default function CreatePage() {
  const canvasRef = React.useRef(null);
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 1024,
        height: 768,
        // viewportTransform: [
        //   0.5,
        //   0,
        //   0,
        //   0.5,
        //   0,
        //   0
        // ]
      });
      initCanvas.renderAll();
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRect = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 200,
        top: 200,
        fill: "red",
        width: 100,
        height: 100,
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: 200,
        top: 200,
        fill: "green",
        radius: 20,
      });
      canvas.add(circle);
    }
  };

  return (
    <div className="relative bg-black text-white overflow-hidden h-screen flex items-center justify-center">
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-[3]">
        <div className="flex flex-col  p-2 rounded-xl gap-3">
          {/* <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => canvas?.clear()}
          >
            <Delete className="text-gray-800" />
          </Button> */}
          <Button size={"icon"} variant={"outline"} onClick={addRect}>
            <span>
              <RectangleHorizontal className="text-gray-800" />
            </span>
          </Button>
          <Button size={"icon"} variant={"outline"} onClick={addCircle}>
            <span>
              <Circle className="text-gray-800" />
            </span>
          </Button>
        </div>
      </div>
      <canvas className="bg-neutral-600/20 rounded-lg z-[2]" ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}

// add settings for shapes
