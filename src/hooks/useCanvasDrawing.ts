
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
      fabricCanvas.freeDrawingBrush.width = 2;
    }
    
    // Ensure objects are rendered correctly by forcing a re-render
    fabricCanvas.renderAll();
  }, [fabricCanvas, isDrawingMode, color]);
};
