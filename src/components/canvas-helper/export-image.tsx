import React from "react";
import { useCanvas } from "@/context/canvas-context";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExportImage = () => {
  const { canvas } = useCanvas();

  const handleExport = React.useCallback(() => {
    if (!canvas) return;

    try {
      // Get the canvas data URL
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      // Create a temporary link element
      const link = document.createElement("a");
      link.download = `canvas-export-${Date.now()}.png`;
      link.href = dataURL;

      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Image exported successfully");
    } catch (error) {
      console.error("Error exporting image:", error);
    }
  }, [canvas]);

  return (
    <div className="fixed bottom-4 left-4 z-[999]">
      <Button
        onClick={handleExport}
        variant="destructive"
        className="backdrop-blur-sm "
        disabled={!canvas}
      >
        <Download className="w-4 h-4 " />
      </Button>
    </div>
  );
};

export default ExportImage;
