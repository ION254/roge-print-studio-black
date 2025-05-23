
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const useCanvasDrawing = (
  fabricCanvas: FabricCanvas | null,
  isDrawingMode: boolean,
  color: string
) => {
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = isDrawingMode;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = 3; // Increased line width for better visibility
      // Set the cursor to indicate drawing mode
      if (isDrawingMode) {
        fabricCanvas.setCursor('pencil');
      } else {
        fabricCanvas.setCursor('default');
      }
    }
    
    // Ensure objects are rendered correctly by forcing a re-render
    fabricCanvas.renderAll();
  }, [fabricCanvas, isDrawingMode, color]);
};
