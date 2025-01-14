import { CanvasProvider } from "@/context/canvas-context";
import { lazy, Suspense } from "react";

// Lazy load components
const Elements = lazy(() => import("@/components/elements/elements"));

const Canvas = lazy(() => import("@/components/canvas/canvas"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-r-2 border-gray-500"></div>
  </div>
);

export default function CreatePage() {
  return (
    <>
      <CanvasProvider>
        <div className="relative bg-black text-white overflow-hidden h-screen flex items-center justify-center">
          <Suspense fallback={<LoadingFallback />}>
            <Elements />
            <div className="relative">
              <Canvas />
              
            </div>
          </Suspense>
        </div>{" "}
      </CanvasProvider>{" "}
    </>
  );
}
