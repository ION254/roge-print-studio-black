
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
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[50vh] flex flex-col"> {/* Adjusted height to 50vh */}
        <DrawerHeader className="text-left flex-shrink-0">
          <DrawerTitle className="text-2xl">Templates</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="py-3">
                  <h3 className="font-medium text-center">{template.name}</h3>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => onTemplateSelect(template)} 
                    className="w-full"
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
