
import { useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

// Template type definition
export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  jsonData: string;
}

// Sample templates
const sampleTemplates: Template[] = [
  {
    id: 't1',
    name: 'T-Shirt Basic',
    thumbnail: '/placeholder.svg',
    jsonData: JSON.stringify({
      type: 't-shirt',
      outline: { /* T-shirt outline data would be here */ }
    })
  },
  {
    id: 't2',
    name: 'Hoodie',
    thumbnail: '/placeholder.svg',
    jsonData: JSON.stringify({
      type: 'hoodie',
      outline: { /* Hoodie outline data would be here */ }
    })
  },
  {
    id: 't3',
    name: 'Cap',
    thumbnail: '/placeholder.svg',
    jsonData: JSON.stringify({
      type: 'cap',
      outline: { /* Cap outline data would be here */ }
    })
  }
];

export const useTemplates = (fabricCanvas: FabricCanvas | null) => {
  const [templates] = useState<Template[]>(sampleTemplates);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);

  const applyTemplate = (template: Template) => {
    if (!fabricCanvas) return;
    
    try {
      // For now just show a toast - we'll handle actual template loading in a future step
      toast.success(`Applied template: ${template.name}`);
      setIsTemplateDrawerOpen(false);
      
      // In a real implementation, we would load the template's JSON data to the canvas
      // fabricCanvas.loadFromJSON(template.jsonData, fabricCanvas.renderAll.bind(fabricCanvas));
    } catch (error) {
      toast.error("Failed to apply template");
      console.error("Error applying template:", error);
    }
  };

  return {
    templates,
    isTemplateDrawerOpen,
    setIsTemplateDrawerOpen,
    applyTemplate
  };
};
