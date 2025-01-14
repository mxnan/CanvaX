import React from 'react';
import { useCanvas } from '@/context/canvas-context';
import { CanvasObject } from '@/context/types';
import { Layers, Image, Type, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LayerView = () => {
  const { canvas, selectedObject, setSelectedObject } = useCanvas();
  const [objects, setObjects] = React.useState<CanvasObject[]>([]);

  // Update objects list when canvas changes
  React.useEffect(() => {
    if (!canvas) return;

    const updateObjects = () => {
      const canvasObjects = canvas.getObjects() as CanvasObject[];
      setObjects(canvasObjects.reverse()); // Reverse to show top-most objects first
    };

    // Initial update
    updateObjects();

    // Update on object modifications
    canvas.on('object:added', updateObjects);
    canvas.on('object:removed', updateObjects);
    canvas.on('object:modified', updateObjects);

    return () => {
      canvas.off('object:added', updateObjects);
      canvas.off('object:removed', updateObjects);
      canvas.off('object:modified', updateObjects);
    };
  }, [canvas]);

  // Get icon based on object type
  const getObjectIcon = (type: string = 'shape') => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  if (!canvas || objects.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[999] w-32">
      <div className="bg-neutral-900/90 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-800">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium">Layers</span>
        </div>
        <AnimatePresence mode="popLayout">
          <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-hide">
            {objects.map((obj) => (
              <motion.div
                key={obj.id || Date.now()}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => {
                  canvas.setActiveObject(obj);
                  setSelectedObject(obj);
                  canvas.requestRenderAll();
                }}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                  selectedObject?.id === obj.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'hover:bg-neutral-800'
                }`}
              >
                {getObjectIcon(obj.objectType)}
                <span className="text-sm truncate">
                  {obj.objectType || 'Object'}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LayerView;
