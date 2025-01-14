import React from "react";
import { useCanvas } from "@/context/canvas-context";
import { Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fabric } from "fabric";
import { Button } from "../ui/button";

type FilterType = {
  name: string;
  filter: fabric.IBaseFilter;
  preview?: string;
};

const ImageFilters = () => {
  const { canvas, selectedObject } = useCanvas();
  // const [showFilters, setShowFilters] = React.useState(true);

  const filters: FilterType[] = [
    { name: "None", filter: new fabric.Image.filters.BaseFilter() },
    { name: "Grayscale", filter: new fabric.Image.filters.Grayscale() },
    { name: "Sepia", filter: new fabric.Image.filters.Sepia() },
    { name: "Invert", filter: new fabric.Image.filters.Invert() },
    { name: "Blur", filter: new fabric.Image.filters.Blur({ blur: 0.05 }) },
    {
      name: "Brightness",
      filter: new fabric.Image.filters.Brightness({ brightness: 0.2 }),
    },
    {
      name: "Contrast",
      filter: new fabric.Image.filters.Contrast({ contrast: 0.2 }),
    },
    {
      name: "Saturation",
      filter: new fabric.Image.filters.Saturation({ saturation: 0.2 }),
    },
  ];

  const applyFilter = (filter: fabric.IBaseFilter) => {
    if (!canvas || !selectedObject || selectedObject.type !== "image") return;

    const imageObject = selectedObject as fabric.Image;
    imageObject.filters = [filter];
    imageObject.applyFilters();
    canvas.requestRenderAll();
  };

  // Only show for selected images
  if (!selectedObject || selectedObject.type !== "image") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-[999] w-[300px]"
      >
        <div className="bg-neutral-900/90 backdrop-blur-lg rounded-lg p-3">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span className="text-sm font-medium">Image Filters</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {filters.map((filterOption) => (
              <Button
                variant={"outline"}
                key={filterOption.name}
                onClick={() => applyFilter(filterOption.filter)}
                className="p-2 rounded text-center"
              >
                <div className="w-full aspect-video  rounded flex items-center justify-center">
                  {/* Preview placeholder - you can add actual filter previews here */}
                  <span className="text-xs text-neutral-400">
                    {filterOption.name}
                  </span>
                </div>
                {/* <span className="text-xs">{filterOption.name}</span> */}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageFilters;
