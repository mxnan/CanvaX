import { 
  Lock, Unlock, Copy, RotateCcw, 
  FlipHorizontal, FlipVertical, 
  ArrowUp, ArrowDown, Trash2 
} from 'lucide-react';

export const objectControls = [
  {
    id: 'lock',
    getDynamicIcon: (isLocked: boolean) => isLocked ? Unlock : Lock,
    action: 'toggleLock',
    tooltip: (isLocked: boolean) => isLocked ? 'Unlock' : 'Lock',
  },
  {
    id: 'duplicate',
    icon: Copy,
    action: 'duplicate',
    tooltip: 'Duplicate',
  },
  {
    id: 'rotate',
    icon: RotateCcw,
    action: 'rotate',
    tooltip: 'Rotate 90°',
  },
  {
    id: 'flipH',
    icon: FlipHorizontal,
    action: 'flipHorizontal',
    tooltip: 'Flip Horizontal',
  },
  {
    id: 'flipV',
    icon: FlipVertical,
    action: 'flipVertical',
    tooltip: 'Flip Vertical',
  },
  {
    id: 'forward',
    icon: ArrowUp,
    action: 'moveForward',
    tooltip: 'Bring Forward',
  },
  {
    id: 'backward',
    icon: ArrowDown,
    action: 'moveBackward',
    tooltip: 'Send Backward',
  },
  {
    id: 'delete',
    icon: Trash2,
    action: 'delete',
    tooltip: 'Delete',
    className: 'hover:bg-red-500/20 hover:text-red-500',
  },
];