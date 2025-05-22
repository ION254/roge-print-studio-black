
import { RefObject, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export type FabricCanvasHook = {
  fabricCanvas: FabricCanvas | null;
  initCanvas: (canvasRef: RefObject<HTMLCanvasElement>) => (() => void) | undefined; // Updated return type
};

export const useDesignCanvas = (): FabricCanvasHook => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  const initCanvas = (canvasRef: RefObject<HTMLCanvasElement>): (() => void) | undefined => {
    if (!canvasRef.current) {
      console.warn("Canvas ref not available during initCanvas.");
      return undefined; // Explicitly return undefined if canvas ref is not current
    }

    const canvasInstance = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selectionColor: 'rgba(100, 100, 255, 0.3)',
      selectionLineWidth: 2,
      preserveObjectStacking: true,
    });
    
    setFabricCanvas(canvasInstance);

    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container && canvasInstance) {
        canvasInstance.setDimensions({
          width: container.clientWidth,
          height: container.clientHeight > 300 ? container.clientHeight : 600
        });
        canvasInstance.renderAll();
      }
    };

    const parentElement = canvasRef.current?.parentElement;
    if (parentElement) {
        const initialWidth = parentElement.clientWidth > 50 ? parentElement.clientWidth - 40 : 760;
        const initialHeight = 600;
        canvasInstance.setDimensions({ width: initialWidth, height: initialHeight});
        canvasInstance.renderAll();
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Ensure canvasInstance exists and is not already disposed before calling dispose
      if (canvasInstance && !canvasInstance.disposed) {
        canvasInstance.dispose();
      }
    };
  };

  return {
    fabricCanvas,
    initCanvas
  };
};

