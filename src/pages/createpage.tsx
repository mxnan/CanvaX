
import { Elements } from "@/components/elements/elements";
import { ObjectControls } from "@/components/canvas-helper/object-controls";
import { Canvas } from "@/components/canvas/canvas";

import { CanvasProvider } from "@/context/canvas-context";

export default function CreatePage() {
  return (
    <CanvasProvider>
      <div className="relative bg-neutral-900 text-white overflow-hidden h-screen flex items-center justify-center">
        <Elements />
        <div className="relative">
          <Canvas />
          <ObjectControls />
        </div>
      </div>
    </CanvasProvider>
  );
}
