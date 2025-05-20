
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MousePointer2, Pencil, Circle, RectangleHorizontal, Trash2, UploadCloud, Type } from 'lucide-react'; // Added Type and UploadCloud

export type ActiveTool = 'select' | 'draw' | 'rectangle' | 'circle' | 'text' | 'image';

interface ToolbarProps {
  activeTool: ActiveTool;
  onToolClick: (tool: ActiveTool) => void;
  onClear: () => void;
  onAddText: () => void; // Placeholder for future
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void; // Placeholder for future
}

const tools: { name: ActiveTool; icon: React.ElementType; label: string }[] = [
  { name: 'select', icon: MousePointer2, label: 'Select Tool' },
  { name: 'draw', icon: Pencil, label: 'Drawing Tool' },
  { name: 'rectangle', icon: RectangleHorizontal, label: 'Add Rectangle' },
  { name: 'circle', icon: Circle, label: 'Add Circle' },
  { name: 'text', icon: Type, label: 'Add Text' },
];

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolClick, onClear, onAddText, onImageUpload }) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card shadow">
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool.name ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => tool.name === 'text' ? onAddText() : onToolClick(tool.name)}
                aria-label={tool.label}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleImageUploadClick}
              aria-label="Upload Image"
            >
              <UploadCloud className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload Image</p>
          </TooltipContent>
        </Tooltip>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          style={{ display: 'none' }}
          onChange={onImageUpload}
        />
        <div className="border-l h-8 mx-2 border-border"></div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear Canvas">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear Canvas</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
