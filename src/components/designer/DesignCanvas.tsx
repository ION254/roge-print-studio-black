
import React, { useEffect, useRef, useState } from 'react';
import { Toolbar, ActiveTool } from './Toolbar';
import { ColorPicker } from './ColorPicker';
import { CanvasActions } from './actions/CanvasActions';
import { useDesignCanvas } from '@/hooks/useDesignCanvas';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { useCanvasShapes } from '@/hooks/useCanvasShapes';
import { useCanvasText } from '@/hooks/useCanvasText';
import { useCanvasImage } from '@/hooks/useCanvasImage';
import { useTemplates } from '@/hooks/useTemplates';
import { Templates } from './Templates';
import { ThreeDView } from './ThreeDView';
import { Measurements } from './Measurements';
import { toast } from 'sonner';

export const DesignCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState<string>('#000000');
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [selectedPrintingMethod, setSelectedPrintingMethod] = useState<string>('dtg');
  
  const { fabricCanvas, initCanvas } = useDesignCanvas();
  const { addShape } = useCanvasShapes(fabricCanvas);
  const { addText } = useCanvasText(fabricCanvas);
  const { handleImageUpload } = useCanvasImage(fabricCanvas);
  const { templates, isTemplateDrawerOpen, setIsTemplateDrawerOpen, applyTemplate } = useTemplates(fabricCanvas);
  
  useEffect(() => {
    const cleanup = initCanvas(canvasRef);
    setIsTemplateDrawerOpen(true);
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initCanvas]);
  
  useCanvasDrawing(
    fabricCanvas, 
    activeTool === 'draw', 
    activeColor
  );

  const handleToolClick = (tool: Extract<ActiveTool, 'select' | 'draw' | 'rectangle' | 'circle'>) => {
    setActiveTool(tool);
    if (fabricCanvas && (tool === 'rectangle' || tool === 'circle')) {
      addShape(tool, activeColor);
    }
  };

  const handleAddText = () => {
    setActiveTool('text');
    if (fabricCanvas) {
      addText(activeColor);
    }
  };

  const handleOpenShapeLibrary = () => {
    setActiveTool('shape-library');
    toast.info("Shape Library opened (placeholder functionality).");
    console.log("Shape Library tool activated. Color:", activeColor);
  };

  const handleOpenSuggestedDesigns = () => {
    setActiveTool('suggested-designs');
    toast.info("Suggested Designs opened (placeholder functionality).");
    console.log("Suggested Designs tool activated. Color:", activeColor);
  };

  const handleOpenTemplates = () => {
    setIsTemplateDrawerOpen(true);
  };

  const handleClearCanvas = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      if (fabricCanvas.backgroundColor !== '#ffffff') {
         fabricCanvas.backgroundColor = '#ffffff';
      }
      fabricCanvas.renderAll();
      toast.info("Canvas cleared!");
    }
  };

  const handleMeasurementsChange = (measurements: Record<string, number>) => {
    console.log('Measurements updated:', measurements);
    toast.info("Measurements updated!");
  };

  const handlePrintingMethodSelect = (method: string) => {
    setSelectedPrintingMethod(method);
    console.log('Printing method selected:', method);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 border-b border-border">
        <Toolbar 
          activeTool={activeTool} 
          onToolClick={handleToolClick}
          onAddText={handleAddText}
          onClear={handleClearCanvas}
          onImageUpload={handleImageUpload}
          onOpenShapeLibrary={handleOpenShapeLibrary}
          onOpenSuggestedDesigns={handleOpenSuggestedDesigns}
          onOpenTemplates={handleOpenTemplates}
          fabricCanvas={fabricCanvas}
          onPrintingMethodSelect={handlePrintingMethodSelect}
        />
        <div className="flex items-center gap-2">
          <ColorPicker color={activeColor} onChange={setActiveColor} />
          {selectedPrintingMethod && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
              {selectedPrintingMethod.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="w-full h-[600px] border border-input rounded-md shadow-lg overflow-hidden bg-white" style={{ minHeight: '600px' }}> 
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          <ThreeDView />
          <Measurements onMeasurementsChange={handleMeasurementsChange} />
        </div>
        <CanvasActions fabricCanvas={fabricCanvas} />
      </div>

      <Templates 
        open={isTemplateDrawerOpen}
        onOpenChange={setIsTemplateDrawerOpen}
        templates={templates}
        onTemplateSelect={applyTemplate}
      />
    </div>
  );
};
