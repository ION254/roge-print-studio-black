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
import { ShapeLibrary } from './ShapeLibrary';
import { ThreeDView } from './ThreeDView';
import { Measurements } from './Measurements';
import { toast } from 'sonner';
import { Group, FabricObject } from 'fabric';

// Extend FabricObject to include custom properties
interface CustomFabricObject extends FabricObject {
  data?: {
    isMockup?: boolean;
    productType?: string;
  };
  id?: string;
  name?: string;
}

interface CustomGroup extends Group {
  data?: {
    isMockup?: boolean;
    productType?: string;
  };
  id?: string;
  name?: string;
}

export const DesignCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingColor, setDrawingColor] = useState<string>('#000000'); // For drawing, shapes, text
  const [mockupColor, setMockupColor] = useState<string>('#cccccc'); // For mockup base color
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [selectedPrintingMethod, setSelectedPrintingMethod] = useState<string>('dtg');
  const [activeMockupObject, setActiveMockupObject] = useState<CustomFabricObject | CustomGroup | null>(null);
  const [isShapeLibraryOpen, setIsShapeLibraryOpen] = useState<boolean>(false);
  
  const { fabricCanvas, initCanvas } = useDesignCanvas();
  const { addShape, addEmblem } = useCanvasShapes(fabricCanvas);
  const { addText } = useCanvasText(fabricCanvas);
  const { handleImageUpload } = useCanvasImage(fabricCanvas);

  // Pass setActiveMockupObject and mockupColor to useTemplates
  const { templates, isTemplateDrawerOpen, setIsTemplateDrawerOpen, applyTemplate, currentMockup } = useTemplates(
    fabricCanvas,
    setActiveMockupObject,
    mockupColor // Initial color for newly applied template
  );
  
  useEffect(() => {
    const cleanup = initCanvas(canvasRef);
    // Auto-open templates when the canvas is initialized
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
    drawingColor // Use drawingColor for free drawing
  );

  // Update mockup color when mockupColor state changes and a mockup is active
  useEffect(() => {
    if (activeMockupObject && fabricCanvas && activeMockupObject.data?.isMockup) {
      if (activeMockupObject instanceof Group) {
        const mockupGroup = activeMockupObject as CustomGroup;
        const productBody = mockupGroup.getObjects().find(obj => (obj as CustomFabricObject).id === 'product_body');
        
        if (productBody) {
          productBody.set('fill', mockupColor);
        } else if (mockupGroup.item(0)) { // Fallback
          mockupGroup.item(0).set('fill', mockupColor);
        }
      } else {
        // If it's a single object, update its fill directly
        activeMockupObject.set('fill', mockupColor);
      }
      fabricCanvas.renderAll();
    }
  }, [mockupColor, activeMockupObject, fabricCanvas]);


  const handleToolClick = (tool: Extract<ActiveTool, 'select' | 'draw' | 'rectangle' | 'circle'>) => {
    setActiveTool(tool);
    if (fabricCanvas && (tool === 'rectangle' || tool === 'circle')) {
      addShape(tool, drawingColor); // Use drawingColor for shapes
    }
  };

  const handleAddText = () => {
    setActiveTool('text');
    if (fabricCanvas) {
      addText(drawingColor); // Use drawingColor for text
    }
  };

  const handleOpenShapeLibrary = () => {
    setActiveTool('shape-library');
    setIsShapeLibraryOpen(true);
  };

  const handleEmblemSelect = (emblem: any) => {
    if (fabricCanvas) {
      addEmblem(emblem, drawingColor);
      toast.success(`${emblem.name} added to canvas!`);
    }
  };

  const handleOpenSuggestedDesigns = () => {
    setActiveTool('suggested-designs');
    toast.info("Suggested Designs opened (placeholder functionality).");
  };

  const handleOpenTemplates = () => {
    setIsTemplateDrawerOpen(true);
  };

  const handleClearCanvas = () => {
    if (fabricCanvas) {
      // If there's a mockup, re-apply it (effectively clearing designs but not mockup itself)
      // Otherwise, clear everything.
      const activeTemplate = templates.find(t => currentMockup && (currentMockup as CustomFabricObject).name === `${t.productType}_mockup`);
      if (activeTemplate && currentMockup) {
          // Clear everything *except* the current mockup
          fabricCanvas.getObjects().forEach(obj => {
              if (obj !== currentMockup) {
                  fabricCanvas.remove(obj);
              }
          });
          // Reset mockup to its initial color if needed, or keep current mockupColor
          if (currentMockup instanceof Group) {
            const productBody = currentMockup.getObjects().find(o => (o as CustomFabricObject).id === 'product_body');
            if (productBody) productBody.set('fill', mockupColor);
            else if (currentMockup.item(0)) currentMockup.item(0).set('fill', mockupColor);
           } else {
             // currentMockup is a single fabric object
             (currentMockup as CustomFabricObject).set('fill', mockupColor);
           }

      } else {
          fabricCanvas.clear();
          if (fabricCanvas.backgroundColor !== '#ffffff') {
             fabricCanvas.backgroundColor = '#ffffff';
          }
          setActiveMockupObject(null); // No active mockup if fully cleared
      }
      fabricCanvas.renderAll();
      toast.info("Canvas designs cleared!");
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
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="mockup-color-picker" className="text-xs text-muted-foreground">Mockup Color</label>
            <ColorPicker color={mockupColor} onChange={setMockupColor} />
          </div>
          <div>
            <label htmlFor="drawing-color-picker" className="text-xs text-muted-foreground">Drawing Color</label>
            <ColorPicker color={drawingColor} onChange={setDrawingColor} />
          </div>
          {selectedPrintingMethod && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded self-end mb-1">
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
          {/* Pass current mockup data to 3D view if needed, or canvas data URL */}
          <ThreeDView 
            canvasData={fabricCanvas?.toDataURL({ format: 'png', quality: 0.8, multiplier: 1 })}
            productType={activeMockupObject?.data?.productType}
          />
          <Measurements onMeasurementsChange={handleMeasurementsChange} />
        </div>
        <CanvasActions fabricCanvas={fabricCanvas} />
      </div>

      <Templates 
        open={isTemplateDrawerOpen}
        onOpenChange={setIsTemplateDrawerOpen}
        templates={templates}
        onTemplateSelect={(template) => applyTemplate(template)} // Pass current mockupColor for initial application
      />

      <ShapeLibrary
        open={isShapeLibraryOpen}
        onOpenChange={setIsShapeLibraryOpen}
        onEmblemSelect={handleEmblemSelect}
      />
    </div>
  );
};
