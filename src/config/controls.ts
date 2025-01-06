import {
  Copy,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Type,
  ImageOff,
  Crop,
  AlignCenter,
  Palette,
} from "lucide-react";
import { Control } from "@/context/canvas-context";

// Shared controls that apply to all objects
export const sharedControls: Control[] = [
  {
    id: "duplicate",
    icon: Copy,
    action: "duplicate",
    tooltip: "Duplicate",
    group: "transform",
  },
  {
    id: "rotate",
    icon: RotateCcw,
    action: "rotate",
    tooltip: "Rotate 90°",
    group: "transform",
  },
  {
    id: "flipH",
    icon: FlipHorizontal,
    action: "flipHorizontal",
    tooltip: "Flip Horizontal",
    group: "transform",
  },
  {
    id: "flipV",
    icon: FlipVertical,
    action: "flipVertical",
    tooltip: "Flip Vertical",
    group: "transform",
  },
  {
    id: "layer-up",
    icon: ArrowUp,
    action: "moveForward",
    tooltip: "Bring Forward",
    group: "layer",
  },
  {
    id: "layer-down",
    icon: ArrowDown,
    action: "moveBackward",
    tooltip: "Send Backward",
    group: "layer",
  },
  {
    id: "delete",
    icon: Trash2,
    action: "delete",
    tooltip: "Delete",
    className: "hover:bg-red-500/20 hover:text-red-500",
    group: "delete",
  },
];

// // Transform controls (only for shapes and images)
// export const transformControls: Control[] = [

// ];

// Shape-specific controls
export const shapeControls: Control[] = [
  {
    id: "fill",
    icon: Palette,
    action: "changeFill",
    tooltip: "Change Fill Color",
    group: "style",
  },
];

// Text-specific controls
export const textControls: Control[] = [
  {
    id: "align",
    icon: AlignCenter,
    action: "toggleAlign",
    tooltip: "Text Alignment",
    group: "text",
  },
  {
    id: "edit",
    icon: Type,
    action: "editText",
    tooltip: "Edit Text",
    group: "text",
  },
];

// Image-specific controls
export const imageControls: Control[] = [
  {
    id: "crop",
    icon: Crop,
    action: "cropImage",
    tooltip: "Crop Image",
    group: "image",
  },
  {
    id: "reset",
    icon: ImageOff,
    action: "resetImage",
    tooltip: "Reset Image",
    group: "image",
  },
];

export const getObjectControls = (objectType: string): Control[] => {
  // Start with shared controls for all objects
  const controls = [...sharedControls];

  // Add object-specific controls based on type
  switch (objectType) {
    case "text":
      return [...controls, ...textControls];
    case "image":
      return [...controls, ...imageControls];
    case "shape":
      return [...controls, ...shapeControls];
    default:
      return controls;
  }
};

// Control groups for visual separation
export const controlGroups = {
  transform: "Transform",
  layer: "Layer",
  style: "Style",
  text: "Text",
  image: "Image",
  delete: "Delete",
} as const;

// Add type for control groups
export type ControlGroup = keyof typeof controlGroups;
