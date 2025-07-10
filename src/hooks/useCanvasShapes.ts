
import { Circle, Rect, Canvas as FabricCanvas, Path, FabricObject } from 'fabric';

type ShapeType = 'circle' | 'rectangle';

interface Emblem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
}

// SVG path data for different shapes - these create vector shapes
const getEmblemPath = (emblemId: string): string => {
  const paths: Record<string, string> = {
    // Basic shapes
    'circle': 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z',
    'square': 'M10,10 L90,10 L90,90 L10,90 Z',
    'triangle': 'M50,10 L90,80 L10,80 Z',
    'diamond': 'M50,10 L80,50 L50,90 L20,50 Z',
    'hexagon': 'M50,5 L75,25 L75,55 L50,75 L25,55 L25,25 Z',
    'star': 'M50,2 L61,35 L98,35 L68,57 L79,91 L50,69 L21,91 L32,57 L2,35 L39,35 Z',
    // Heart shape
    'heart': 'M50,85 C50,85 20,60 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,60 50,85 50,85 Z',
    // Crown
    'crown': 'M10,70 L90,70 L85,40 L70,50 L60,30 L50,45 L40,30 L30,50 L15,40 Z',
    // Shield
    'shield': 'M50,10 C30,10 15,20 15,35 L15,60 C15,75 30,85 50,90 C70,85 85,75 85,60 L85,35 C85,20 70,10 50,10 Z',
    // Simple arrow up
    'arrow-up': 'M50,10 L75,40 L60,40 L60,80 L40,80 L40,40 L25,40 Z',
    'arrow-down': 'M50,90 L75,60 L60,60 L60,20 L40,20 L40,60 L25,60 Z',
    'arrow-left': 'M10,50 L40,25 L40,40 L80,40 L80,60 L40,60 L40,75 Z',
    'arrow-right': 'M90,50 L60,25 L60,40 L20,40 L20,60 L60,60 L60,75 Z',
    // Default fallback - simple circle
    'default': 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z'
  };
  
  return paths[emblemId] || paths['default'];
};

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

  const addEmblem = (emblem: Emblem, color: string) => {
    if (!fabricCanvas) return;

    try {
      const pathData = getEmblemPath(emblem.id);
      
      const pathObject = new Path(pathData, {
        left: 150,
        top: 150,
        fill: color,
        stroke: '#000000',
        strokeWidth: 1,
        scaleX: 1,
        scaleY: 1,
        hasControls: true,
        hasBorders: true,
        lockUniScaling: false,
        selectable: true,
      });

      // Set a reasonable size for the emblem
      pathObject.scaleToWidth(80);
      
      fabricCanvas.add(pathObject);
      fabricCanvas.setActiveObject(pathObject);
      fabricCanvas.renderAll();
    } catch (error) {
      console.error('Error adding emblem:', error);
      // Fallback to a simple circle if emblem creation fails
      const circle = new Circle({
        left: 150,
        top: 150,
        fill: color,
        radius: 40,
        stroke: '#000000',
        strokeWidth: 1,
        hasControls: true,
        hasBorders: true,
        lockUniScaling: false,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
      fabricCanvas.renderAll();
    }
  };

  return { addShape, addEmblem };
};
