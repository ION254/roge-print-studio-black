
import { Circle, Rect, Canvas as FabricCanvas } from 'fabric';

type ShapeType = 'circle' | 'rectangle';

export const useCanvasShapes = (fabricCanvas: FabricCanvas | null) => {
  const addShape = (shapeType: ShapeType, color: string) => {
    if (!fabricCanvas) return;

    if (shapeType === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: color,
        width: 100,
        height: 100,
        stroke: '#000000',
        strokeWidth: 1,
        hasControls: true,
        hasBorders: true,
        lockUniScaling: false,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (shapeType === 'circle') {
      const circle = new Circle({
        left: 150,
        top: 150,
        fill: color,
        radius: 50,
        stroke: '#000000',
        strokeWidth: 1,
        hasControls: true,
        hasBorders: true,
        lockUniScaling: false,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    }

    fabricCanvas.renderAll();
  };

  return { addShape };
};
