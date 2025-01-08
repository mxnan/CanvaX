import { fabric } from "fabric";

// Base Types
export interface CanvasObject extends fabric.Object {
  id?: string;
  zIndex?: number;
  objectType?: string;
}

export interface Position {
  top: number;
  left: number;
}

// Control Types
export type ControlAction = 
  | "duplicate"
  | "rotate"
  | "flipHorizontal"
  | "flipVertical"
  | "moveForward"
  | "moveBackward"
  | "delete"
  | "changeFill"
  | "editText"
  | "toggleAlign"
  | "cropImage"
  | "resetImage";

export interface Control {
  id: string;
  icon: React.ElementType;
  action: ControlAction;
  tooltip: string;
  className?: string;
  group: ControlGroup;
  isActive?: boolean;
}

export type ControlGroup = "transform" | "layer" | "style" | "text" | "image" | "delete";

// Tool Types
export interface ShapeTool {
  id: string;
  icon: React.ElementType;
  tooltip: string;
  type: "shape" | "text" | "image" | "action";
}
