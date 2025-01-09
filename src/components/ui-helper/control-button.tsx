import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ControlButtonProps {
  control: {
    id: string;
    icon?: React.ElementType;
    tooltip: string;
    className?: string;
  };
  onClick: () => void;
}
 const ControlButton = ({
  control,
  onClick,
}: ControlButtonProps) => {
  const Icon = control.icon;

  return (
    <Button
      size="icon"
      className={cn(
        "h-8 w-8 relative group hover:bg-neutral-800",
        control.className
      )}
      
      onClick={onClick}
    >
      {Icon && <Icon size={16} />}
      <span
        className={cn(
          "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-xs text-white rounded-md invisible group-hover:visible whitespace-nowrap backdrop-blur-sm backdrop-filter"
        )}
      >
        {control.tooltip}
      </span>
    </Button>
  );
};

export default ControlButton;
