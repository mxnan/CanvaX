import React from "react";
import { Button } from "@/components/ui/button";
// import { useCanvas } from "@/context/canvas-context";
import { motion, AnimatePresence } from "framer-motion";

const CropControls: React.FC = () => {
  // const { isCropping, applyCrop } = useCanvas();

  // if (!isCropping) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-1/2 -translate-y-1/2 right-0 transform  z-[9999] flex gap-2"
      >
        <Button 
        variant="secondary" 
        // onClick={applyCrop}
        >
          Apply Crop
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}

export default CropControls;