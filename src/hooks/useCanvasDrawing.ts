
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const useCanvasDrawing = (
  fabricCanvas: FabricCanvas | null,
  isDrawingMode: boolean,
  color: string
) => {
  useEffect(() => {
    if (!fabricCanvas) {
      console.log('Canvas not available for drawing setup');
      return;
    }

    console.log('Setting drawing mode:', isDrawingMode, 'with color:', color);
    
    // Set drawing mode
    fabricCanvas.isDrawingMode = isDrawingMode;
    
    // Configure the brush if available
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = 3;
      console.log('Brush configured:', {
        color: fabricCanvas.freeDrawingBrush.color,
        width: fabricCanvas.freeDrawingBrush.width,
        isDrawingMode: fabricCanvas.isDrawingMode
      });
    } else {
      console.error('FreeDrawingBrush not available when trying to configure drawing');
    }
    
    // Set the cursor to indicate drawing mode
    if (isDrawingMode) {
      fabricCanvas.setCursor('crosshair');
      fabricCanvas.hoverCursor = 'crosshair';
      fabricCanvas.moveCursor = 'crosshair';
    } else {
      fabricCanvas.setCursor('default');
      fabricCanvas.hoverCursor = 'move';
      fabricCanvas.moveCursor = 'move';
    }
    
    // Ensure objects are rendered correctly by forcing a re-render
    fabricCanvas.renderAll();
  }, [fabricCanvas, isDrawingMode, color]);
};
