
import React from 'react';
import { Button } from '@/components/ui/button';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface CanvasActionsProps {
  fabricCanvas: FabricCanvas | null;
}

export const CanvasActions: React.FC<CanvasActionsProps> = ({ fabricCanvas }) => {
  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    toast.info('Canvas cleared!');
  };

  const handleSaveDesign = () => {
    if (!fabricCanvas) return;
    const jsonData = fabricCanvas.toDatalessJSON();
    console.log(JSON.stringify(jsonData));
    toast.success('Design saved (to console)!');
  };

  return (
    <div className="flex justify-between items-center w-full">
      <Button variant="outline" onClick={handleClear}>Clear Canvas</Button>
      <Button onClick={handleSaveDesign} size="lg">Save Design</Button>
    </div>
  );
};
