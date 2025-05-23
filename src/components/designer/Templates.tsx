
import React from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[40vh] flex flex-col"> {/* Reduced height to 40vh */}
        <DrawerHeader className="text-left flex-shrink-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-2xl">Templates</DrawerTitle>
            <DrawerClose />
          </div>
        </DrawerHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-8"> {/* Increased columns, reduced gap */}
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="py-2"> {/* Reduced padding */}
                  <h3 className="font-medium text-center text-sm">{template.name}</h3> {/* Reduced text size */}
                </CardContent>
                <CardFooter className="pb-2">
                  <Button 
                    onClick={() => handleTemplateClick(template)}
                    className="w-full text-sm py-1" /* Smaller button */
                    size="sm"
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
