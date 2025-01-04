import { Canvas } from "@/components/canvas";
import { Elements } from "@/components/elements";
import { ObjectControls } from "@/components/object-controls";

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
