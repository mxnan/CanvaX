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
  // strokeWidth: 2,
  // stroke: "#000000",
  // cornerStyle: "circle" as any,
  // transparentCorners: false,
  // cornerColor: "#2196F3",
  // cornerSize: 8,
  // padding: 10,
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

    // case 'text':
    //   shape = new fabric.IText("Double click to edit", {
    //     ...defaultProps,
    //     fontSize: 24,
    //     fill: "#000000",
    //     fontFamily: "Arial",
    //     ...options,
    //   });
    //   break;

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

  // if (shape) {
  //   shape.set({
  //     // objectType: type as any,
  //     // id: `${type}_${Date.now()}`,
  //   });
  // }

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
