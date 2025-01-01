import React from "react";
import { fabric } from "fabric";
export default function CreatePage() {
  const canvasRef = React.useRef(null);
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 320,
        height: 500,
      });
      initCanvas.renderAll();
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);
  return (
    <div className="bg-black h-screen flex items-center justify-center">
      <canvas className="bg-neutral-950 z-[2] static" ref={canvasRef} />
    </div>
  );
}
