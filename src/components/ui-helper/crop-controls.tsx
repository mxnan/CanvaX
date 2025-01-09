import React from "react";
import { Button } from "@/components/ui/button";
import { useCanvas } from "@/context/canvas-context";

export const CropControls: React.FC = () => {
  const { isCropping, applyCrop } = useCanvas();

  if (!isCropping) return null;

  const handleApplyCrop = () => {
    applyCrop();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-neutral-800 z-50">
      <Button variant="secondary" onClick={handleApplyCrop}>
        Apply Crop
      </Button>
    </div>
  );
};
