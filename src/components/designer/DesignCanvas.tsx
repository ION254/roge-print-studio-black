
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect,Textbox, util } from 'fabric';
import { Toolbar, ActiveTool } from './Toolbar';
import { ColorPicker } from './ColorPicker';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // For potential future save button

export const DesignCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState<string>('#000000');
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800, // Default width
      height: 600, // Default height
      backgroundColor: '#ffffff',
      // Set controls visibility for better UX
      selectionColor: 'rgba(100, 100, 255, 0.3)',
      selectionLineWidth: 2,
      preserveObjectStacking: true,
    });
    
    // Initialize freeDrawingBrush properties
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Let's get creative.");

    // Handle window resize to make canvas responsive
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container && canvas) {
        canvas.setDimensions({
          width: container.clientWidth,
          height: container.clientHeight > 300 ? container.clientHeight : 600 // Min height
        });
        canvas.renderAll();
      }
    };

    // Initial resize
    const parentElement = canvasRef.current?.parentElement;
    if (parentElement) {
        // Ensure canvas fits parent initially, with some padding for toolbar etc.
        const initialWidth = parentElement.clientWidth > 50 ? parentElement.clientWidth - 40 : 760; // 20px padding on each side
        const initialHeight = 600; // Keep height fixed for now or make it dynamic
        canvas.setDimensions({ width: initialWidth, height: initialHeight});
        canvas.renderAll();
    }


    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []); // Empty dependency array: run once on mount

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'draw';
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 2; // Or make this configurable later
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const handleToolClick = (tool: ActiveTool) => {
    setActiveTool(tool);
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = tool === 'draw';

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
        stroke: '#000000', // Optional: add stroke
        strokeWidth: 1,     // Optional: stroke width
        // Allow transformations
        hasControls: true,
        hasBorders: true,
        lockUniScaling: false,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect); // Make the new shape active
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 150,
        top: 150,
        fill: activeColor,
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

  const handleAddText = () => {
    if (!fabricCanvas) return;
    setActiveTool('text'); // Set active tool to text, though drawing mode will be false
    fabricCanvas.isDrawingMode = false;

    const textbox = new Textbox('Your Text Here', {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 24,
      fill: activeColor,
      hasControls: true,
      hasBorders: true,
      editable: true, // Make the text editable on double click
    });
    fabricCanvas.add(textbox);
    fabricCanvas.setActiveObject(textbox);
    fabricCanvas.renderAll();
    toast.info("Text added! Double-click to edit.");
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || !event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target?.result as string;
      util.loadImage(data, (img) => {
        if (img) {
           const fabricImage = new util.enlivenObjects([img],function(arg0: object[]): void {  })[0];
          fabricImage.set({
            left: 100,
            top: 100,
            scaleX: 0.5, // Initial scale, adjust as needed
            scaleY: 0.5,
            hasControls: true,
            hasBorders: true,
          });
          fabricCanvas.add(fabricImage);
          fabricCanvas.setActiveObject(fabricImage);
          fabricCanvas.renderAll();
          toast.success("Image added to canvas!");
        } else {
            toast.error("Could not load image.");
        }
      });
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset file input
  };


  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    // Re-set background color after clearing if it's removed by clear()
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    toast.info('Canvas cleared!');
  };

  // Placeholder for saving design
  const handleSaveDesign = () => {
    if (!fabricCanvas) return;
    const jsonData = fabricCanvas.toDatalessJSON();
    console.log(JSON.stringify(jsonData)); // For now, log to console
    // Here you would typically send this to a backend or store in localStorage
    toast.success('Design saved (to console)!');
  };
  

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 border-b border-border">
        <Toolbar 
            activeTool={activeTool} 
            onToolClick={handleToolClick} 
            onClear={handleClear}
            onAddText={handleAddText}
            onImageUpload={handleImageUpload}
        />
        <ColorPicker color={activeColor} onChange={setActiveColor} />
      </div>
      {/* Container for canvas for responsive sizing */}
      <div className="w-full h-[600px] border border-input rounded-md shadow-lg overflow-hidden bg-white" style={{ minHeight: '600px' }}> 
        <canvas ref={canvasRef} />
      </div>
       <div className="mt-4 text-center">
        <Button onClick={handleSaveDesign} size="lg">Save Design (Preview)</Button>
      </div>
    </div>
  );
};
