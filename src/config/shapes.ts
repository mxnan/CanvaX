import { 
  RectangleHorizontal, Circle, Triangle, 
  Type, Star, ImageIcon, CircleX 
} from 'lucide-react';

export const SHAPE_TOOLS = [
  {
    id: 'rectangle',
    icon: RectangleHorizontal,
    tooltip: 'Rectangle',
    type: 'shape'
  },
  {
    id: 'circle',
    icon: Circle,
    tooltip: 'Circle',
    type: 'shape'
  },
  {
    id: 'triangle',
    icon: Triangle,
    tooltip: 'Triangle',
    type: 'shape'
  },
  {
    id: 'text',
    icon: Type,
    tooltip: 'Text',
    type: 'text'
  },
  {
    id: 'star',
    icon: Star,
    tooltip: 'Star',
    type: 'shape'
  },
  {
    id: 'image',
    icon: ImageIcon,
    tooltip: 'Image',
    type: 'image'
  },
  {
    id: 'clear',
    icon: CircleX,
    tooltip: 'Clear Canvas',
    type: 'action'
  }
];