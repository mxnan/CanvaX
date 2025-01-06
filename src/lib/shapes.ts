import { fabric } from "fabric";
type CanvasObject = fabric.Object;

interface ShapeProps {
  canvas: fabric.Canvas;
  type: string;
  options?: fabric.IObjectOptions;
}

const getDefaultProps = (canvas: fabric.Canvas) => ({
  left: canvas.width! / 2,
  top: canvas.height! / 2,
  fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
  originX: "center",
  originY: "center",
});

export const createShape = ({
  canvas,
  type,
  options = {},
}: ShapeProps): CanvasObject | null => {
  const defaultProps = getDefaultProps(canvas);
  let shape: CanvasObject | null = null;

  switch (type) {
    case "rectangle":
      shape = new fabric.Rect({
        ...defaultProps,
        width: 100,
        height: 100,
        ...options,
      });
      break;

    case "circle":
      shape = new fabric.Circle({
        ...defaultProps,
        radius: 50,
        ...options,
      });
      break;

    case "triangle":
      shape = new fabric.Triangle({
        ...defaultProps,
        width: 100,
        height: 100,
        ...options,
      });
      break;

    case "star":
      {
        const starPath = createStarPath(5, 25, 50);
        shape = new fabric.Path(starPath, {
          ...defaultProps,
          ...options,
        });
      }
      break;
  }

  if (shape) {
    shape.set({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      objectType: 'shape' as any, // Use 'as any' to bypass the type checking
      id: `${type}_${Date.now()}`,
    } as Partial<CanvasObject>); // Assert this as Partial<CanvasObject>
  }

  return shape;
};

export const createStarPath = (
  points: number,
  inner: number,
  outer: number
): string => {
  let path = "M ";
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points;
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);
    path += `${x},${y} `;
  }
  path += "z";
  return path;
};
