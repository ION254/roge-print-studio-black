
import React, { useEffect, useRef, useState } from 'react';
import { Toolbar, ActiveTool } from './Toolbar';
import { ColorPicker } from './ColorPicker';
import { CanvasActions } from './actions/CanvasActions';
import { useDesignCanvas } from '@/hooks/useDesignCanvas';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { useCanvasShapes } from '@/hooks/useCanvasShapes';
import { useCanvasText } from '@/hooks/useCanvasText';
import { useCanvasImage } from '@/hooks/useCanvasImage';

export const DesignCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState<string>('#000000');
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  
  // Use our custom hooks
  const { fabricCanvas, initCanvas } = useDesignCanvas();
  const { addShape } = useCanvasShapes(fabricCanvas);
  const { addText } = useCanvasText(fabricCanvas);
  const { handleImageUpload } = useCanvasImage(fabricCanvas);
  
  // Initialize canvas on mount
  useEffect(() => {
    const cleanup = initCanvas(canvasRef);
    return cleanup;
  }, []); // Empty dependency array: run once on mount
  
  // Set up drawing mode based on active tool and color
  useCanvasDrawing(
    fabricCanvas, 
    activeTool === 'draw', 
    activeColor
  );

  const handleToolClick = (tool: ActiveTool) => {
    setActiveTool(tool);
    
    if (tool === 'rectangle' || tool === 'circle') {
      addShape(tool, activeColor);
    }
  };

  const handleAddText = () => {
    setActiveTool('text');
    addText(activeColor);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 border-b border-border">
        <Toolbar 
          activeTool={activeTool} 
          onToolClick={handleToolClick} 
          onClear={() => {
            if (fabricCanvas) {
              fabricCanvas.clear();
              fabricCanvas.backgroundColor = '#ffffff';
              fabricCanvas.renderAll();
            }
          }}
          onAddText={handleAddText}
          onImageUpload={handleImageUpload}
        />
        <ColorPicker color={activeColor} onChange={setActiveColor} />
      </div>
      <div className="w-full h-[600px] border border-input rounded-md shadow-lg overflow-hidden bg-white" style={{ minHeight: '600px' }}> 
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 text-center">
        <CanvasActions fabricCanvas={fabricCanvas} />
      </div>
    </div>
  );
};
