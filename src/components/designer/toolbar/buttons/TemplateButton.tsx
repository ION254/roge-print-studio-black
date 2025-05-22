
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Templates as TemplatesIcon } from 'lucide-react';

interface TemplateButtonProps {
  onClick: () => void;
}

export const TemplateButton: React.FC<TemplateButtonProps> = ({ onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label="Templates"
        >
          <TemplatesIcon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Templates</p>
      </TooltipContent>
    </Tooltip>
  );
};
