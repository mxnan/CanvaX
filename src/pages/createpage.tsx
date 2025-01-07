import { lazy, Suspense } from "react";
import { CanvasProvider } from "@/context/canvas-context";

// Lazy load components
const Elements = lazy(() => import("@/components/elements/elements"));
const ObjectControls = lazy(
  () => import("@/components/canvas-helper/object-controls")
);
const Canvas = lazy(() => import("@/components/canvas/canvas"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
  </div>
);

export default function CreatePage() {
  return (
    <CanvasProvider>
      <div className="relative bg-neutral-900 text-white overflow-hidden h-screen flex items-center justify-center">
        <Suspense fallback={<LoadingFallback />}>
          <Elements />
          <div className="relative">
            <Canvas />
            <ObjectControls />
          </div>
        </Suspense>
      </div>
    </CanvasProvider>
  );
}
