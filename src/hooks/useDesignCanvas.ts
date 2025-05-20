
import { useEffect, useState, RefObject } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
// Removed unused import of toast from 'sonner'

export type FabricCanvasHook = {
  fabricCanvas: FabricCanvas | null;
  initCanvas: (canvasRef: RefObject<HTMLCanvasElement>) => void;
};

export const useDesignCanvas = (): FabricCanvasHook => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  const initCanvas = (canvasRef: RefObject<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selectionColor: 'rgba(100, 100, 255, 0.3)',
      selectionLineWidth: 2,
      preserveObjectStacking: true,
    });
    
    setFabricCanvas(canvas);
    // Removed toast.success("Canvas ready! Let's get creative.");

    // Handle window resize to make canvas responsive
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container && canvas) {
        canvas.setDimensions({
          width: container.clientWidth,
          height: container.clientHeight > 300 ? container.clientHeight : 600
        });
        canvas.renderAll();
      }
    };

    // Initial resize
    const parentElement = canvasRef.current?.parentElement;
    if (parentElement) {
        const initialWidth = parentElement.clientWidth > 50 ? parentElement.clientWidth - 40 : 760;
        const initialHeight = 600;
        canvas.setDimensions({ width: initialWidth, height: initialHeight});
        canvas.renderAll();
    }

    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  };

  return {
    fabricCanvas,
    initCanvas
  };
};

