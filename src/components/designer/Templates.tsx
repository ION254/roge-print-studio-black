
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Template } from '@/hooks/useTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplatesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

export const Templates: React.FC<TemplatesProps> = ({ 
  open, 
  onOpenChange, 
  templates, 
  onTemplateSelect 
}) => {
  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template);
    // Explicitly close the drawer after template selection
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Template</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-8">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTemplateClick(template)}>
                <div className="aspect-square relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="py-3">
                  <h3 className="font-medium text-center text-sm">{template.name}</h3>
                </CardContent>
                <CardFooter className="pb-3 pt-0">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateClick(template);
                    }}
                    className="w-full text-sm"
                    size="sm"
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
