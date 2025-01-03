import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { fabric } from "fabric";

interface SettingsProps {
  canvas: fabric.Canvas | null;
}

interface FabricObject extends fabric.Object {
  width?: number;
  height?: number;
  fill?: string;
  radius?: number;
}

function Settings({ canvas }: SettingsProps) {
  const [selectedObject, setSelectedObject] =
    React.useState<FabricObject | null>(null);
  const [width, setWidth] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("");
  const [diameter, setDiameter] = React.useState<string>("");

  React.useEffect(() => {
    if (canvas) {
      //creation
      canvas.on("selection:created", (event: fabric.IEvent) => {
        const selected = event as fabric.IEvent & { selected: FabricObject[] };
        handleObjectSelection(selected.selected[0]);
      });

      canvas.on("selection:updated", (event: fabric.IEvent) => {
        const selected = event as fabric.IEvent & { selected: FabricObject[] };
        handleObjectSelection(selected.selected[0]);
      });

      //deselection
      canvas.on("selection:cleared", () => {
        handleObjectSelection(null);
        clearSettings();
      });

      //object modified
      canvas.on("object:modified", (event: fabric.IEvent) => {
        const modified = event as fabric.IEvent & { target: FabricObject };
        handleObjectSelection(modified.target);
      });

      //scaling
      canvas.on("object:scaled", (event: fabric.IEvent) => {
        const scaled = event as fabric.IEvent & { target: FabricObject };
        handleObjectSelection(scaled.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object: FabricObject | null) => {
    if (!object) return;

    setSelectedObject(object);

    if (object.type === "rect") {
      setWidth(
        Math.round((object.width ?? 0) * (object.scaleX ?? 1)).toString()
      );
      setHeight(
        Math.round((object.height ?? 0) * (object.scaleY ?? 1)).toString()
      );
      setColor(object.fill ?? "");
      setDiameter("");
    } else if (object.type === "circle") {
      setDiameter(
        Math.round((object.radius ?? 0) * 2 * (object.scaleX ?? 1)).toString()
      );
      setColor(object.fill ?? "");
      setWidth("");
      setHeight("");
    }
  };

  const clearSettings = () => {
    setSelectedObject(null); // Clear selected object state
    setWidth("");
    setHeight("");
    setColor("");
    setDiameter("");
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setWidth(value);

    if (
      selectedObject &&
      canvas &&
      selectedObject.type === "rect" &&
      intValue >= 0
    ) {
      selectedObject.set({ width: intValue / (selectedObject.scaleX ?? 1) });
      canvas.renderAll();
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setHeight(value);

    if (
      selectedObject &&
      canvas &&
      selectedObject.type === "rect" &&
      intValue >= 0
    ) {
      selectedObject.set({ height: intValue / (selectedObject.scaleY ?? 1) });
      canvas.renderAll();
    }
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setDiameter(value);

    if (
      selectedObject &&
      canvas &&
      selectedObject.type === "circle" &&
      intValue >= 0
    ) {
      selectedObject.set({
        radius: intValue / 2 / (selectedObject.scaleX ?? 1),
      });
      canvas.renderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);
    if (selectedObject && canvas && value) {
      selectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  return (
    <div className="fixed z-[3] top-1/2 right-2 -translate-y-1/2">
      <div className="relative bg-neutral-900/80 border-muted-foreground rounded-xl">
        {selectedObject && selectedObject.type === "rect" ? (
          <div className="flex flex-col p-3 gap-2">
            <>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={width}
                placeholder={width}
                onChange={handleWidthChange}
                className="w-16"
              />
            </>
            <>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={height}
                onChange={handleHeightChange}
                className="w-16"
              />
            </>

            <>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-16 h-12"
              />
            </>
          </div>
        ) : selectedObject && selectedObject.type === "circle" ? (
          <div className="flex flex-col p-3 gap-2">
            <>
              <Label htmlFor="width">Diameter</Label>
              <Input
                id="width"
                value={diameter}
                onChange={handleDiameterChange}
                className="w-16"
              />
            </>
            <>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-16 h-12"
              />
            </>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Settings;
