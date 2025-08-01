
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Template } from '@/hooks/useTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Palette, Tag } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template);
    onOpenChange(false);
  };

  // Group templates by category
  const categories = Array.from(new Set(templates.map(t => t.category)));
  const popularTemplates = templates.filter(t => t.popular);
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : selectedCategory === 'popular'
    ? popularTemplates
    : templates.filter(t => t.category === selectedCategory);

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card 
      key={template.id} 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-muted hover:border-primary/50 relative z-10" 
      onClick={() => handleTemplateClick(template)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img 
          src={template.thumbnail} 
          alt={template.name}
          className="object-cover w-full h-full transform-gpu transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {template.popular && (
          <Badge className="absolute top-1 right-1 bg-yellow-500 text-yellow-900 hover:bg-yellow-500 z-20 text-xs px-1 py-0">
            <Star className="w-2 h-2 mr-1" />
            Popular
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      </div>
      
      <CardHeader className="pb-1 px-2 pt-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-1">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {template.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-2 px-2">
        <div className="flex items-center gap-1 mb-2">
          <Palette className="w-2 h-2 text-muted-foreground" />
          <div className="flex gap-0.5">
            {template.availableColors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
            {template.availableColors.length > 3 && (
              <span className="text-xs text-muted-foreground ml-1">+{template.availableColors.length - 3}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tag className="w-2 h-2 text-muted-foreground" />
          <div className="flex flex-wrap gap-0.5">
            {template.tags.slice(0, 1).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-2 pb-2">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            handleTemplateClick(template);
          }}
          className="w-full text-xs h-7"
          size="sm"
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col z-50 bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Palette className="w-6 h-6" />
            Choose Your Template
          </DialogTitle>
          <DialogDescription className="sr-only">
            Select a template to start designing your custom product
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
          <TabsList className="flex w-full mx-4 mb-4 overflow-x-auto bg-muted">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 px-4 relative z-0">
            <TabsContent value={selectedCategory} className="mt-0 relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-8 relative z-0">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No templates found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try selecting a different category or check back later for new templates.
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
