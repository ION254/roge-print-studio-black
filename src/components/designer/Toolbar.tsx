
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SelectButton } from './toolbar/buttons/SelectButton';
import { DrawButton } from './toolbar/buttons/DrawButton';
import { RectangleButton } from './toolbar/buttons/RectangleButton';
import { CircleButton } from './toolbar/buttons/CircleButton';
import { TextButton } from './toolbar/buttons/TextButton';
import { ImageUploadButton } from './toolbar/buttons/ImageUploadButton';
import { ClearButton } from './toolbar/buttons/ClearButton';
import { ShapeLibraryButton } from './toolbar/buttons/ShapeLibraryButton';
import { SuggestedDesignsButton } from './toolbar/buttons/SuggestedDesignsButton';
import { TemplateButton } from './toolbar/buttons/TemplateButton'; // New Template Button

export type ActiveTool = 
  | 'select' 
  | 'draw' 
  | 'rectangle' 
  | 'circle' 
  | 'text' 
  | 'shape-library'
  | 'suggested-designs';

interface ToolbarProps {
  activeTool: ActiveTool;
  onToolClick: (tool: Extract<ActiveTool, 'select' | 'draw' | 'rectangle' | 'circle'>) => void;
  onAddText: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onOpenShapeLibrary: () => void;
  onOpenSuggestedDesigns: () => void;
  onOpenTemplates: () => void; // New prop for templates
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool, 
  onToolClick, 
  onAddText,
  onImageUpload,
  onClear,
  onOpenShapeLibrary,
  onOpenSuggestedDesigns,
  onOpenTemplates // New prop handler
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card shadow flex-wrap">
        <SelectButton onClick={() => onToolClick('select')} isActive={activeTool === 'select'} />
        <DrawButton onClick={() => onToolClick('draw')} isActive={activeTool === 'draw'} />
        <RectangleButton onClick={() => onToolClick('rectangle')} isActive={activeTool === 'rectangle'} />
        <CircleButton onClick={() => onToolClick('circle')} isActive={activeTool === 'circle'} />
        <TextButton onClick={onAddText} isActive={activeTool === 'text'} />
        <ShapeLibraryButton onClick={onOpenShapeLibrary} isActive={activeTool === 'shape-library'} />
        <SuggestedDesignsButton onClick={onOpenSuggestedDesigns} isActive={activeTool === 'suggested-designs'} />
        <TemplateButton onClick={onOpenTemplates} /> {/* New Templates button */}
        
        <ImageUploadButton onImageUpload={onImageUpload} />
        
        <div className="border-l h-8 mx-2 border-border"></div>
        <ClearButton onClick={onClear} />
      </div>
    </TooltipProvider>
  );
};
