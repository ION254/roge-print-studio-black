
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-muted hover:border-primary/50" 
      onClick={() => handleTemplateClick(template)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={template.thumbnail} 
          alt={template.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {template.popular && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-3 h-3 text-muted-foreground" />
          <div className="flex gap-1">
            {template.availableColors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
            {template.availableColors.length > 4 && (
              <span className="text-xs text-muted-foreground">+{template.availableColors.length - 4}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Tag className="w-3 h-3 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
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
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Palette className="w-6 h-6" />
            Choose Your Template
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-auto mx-4 mb-4">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 px-4">
            <TabsContent value={selectedCategory} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
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
