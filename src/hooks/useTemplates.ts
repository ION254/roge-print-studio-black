
import { useState } from 'react';
import { Canvas as FabricCanvas, util, Group } from 'fabric';
import { toast } from 'sonner';

// Updated Template type definition
export interface Template {
  id: string;
  name: string;
  thumbnail: string; // URL to an image, or perhaps a data URI for simple SVG thumbnails
  productType: 't-shirt' | 'hoodie' | 'cap' | 'general';
  svgString?: string; // SVG content for the mockup
  // jsonData might still be useful for other complex template types
}

const T_SHIRT_SVG = `<svg width="200" height="200" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g id="tshirt-group"><path id="product_body" d="M10 10 H40 V30 H32 V25 H18 V30 H10 V10 M10 10 L5 15 H10 M40 10 L45 15 H40 M22 10 Q25 5 28 10" fill="#cccccc" stroke="black" stroke-width="0.5"/></g></svg>`;
const HOODIE_SVG = `<svg width="200" height="200" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g id="hoodie-group"><path id="product_body" d="M10 15 H40 V35 H30 V45 H20 V35 H10 V15 M10 15 L2 20 H10 M40 15 L48 20 H40 M15 15 Q25 5 35 15 L30 12 H20 L15 15" fill="#cccccc" stroke="black" stroke-width="0.5"/><rect x="18" y="27" width="14" height="7" fill="rgba(0,0,0,0.05)" stroke="rgba(0,0,0,0.2)" stroke-width="0.2" /></g></svg>`;
const CAP_SVG = `<svg width="200" height="200" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g id="cap-group"><path id="product_body" d="M10 25 C10 18 15 15 25 15 C35 15 40 18 40 25 M5 25 H45 M10 25 A20 5 0 0 0 40 25" fill="#cccccc" stroke="black" stroke-width="0.5"/><circle cx="25" cy="17" r="1" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" stroke-width="0.2" /></g></svg>`;

// Sample templates updated with SVG strings
const sampleTemplates: Template[] = [
  {
    id: 't1',
    name: 'T-Shirt Basic',
    thumbnail: '/placeholder.svg', // Replace with actual t-shirt thumbnail if available
    productType: 't-shirt',
    svgString: T_SHIRT_SVG,
  },
  {
    id: 't2',
    name: 'Hoodie Classic',
    thumbnail: '/placeholder.svg', // Replace with actual hoodie thumbnail
    productType: 'hoodie',
    svgString: HOODIE_SVG,
  },
  {
    id: 't3',
    name: 'Cap Standard',
    thumbnail: '/placeholder.svg', // Replace with actual cap thumbnail
    productType: 'cap',
    svgString: CAP_SVG,
  },
  {
    id: 'general-blank',
    name: 'Blank Canvas',
    thumbnail: '/placeholder.svg',
    productType: 'general',
  }
];

export const useTemplates = (
  fabricCanvas: FabricCanvas | null,
  setActiveMockupObject: (obj: fabric.Object | Group | null) => void,
  activeColor: string
) => {
  const [templates] = useState<Template[]>(sampleTemplates);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [currentMockup, setCurrentMockup] = useState<Group | null>(null);

  const applyTemplate = (template: Template) => {
    if (!fabricCanvas) return;

    // Clear existing mockup first
    if (currentMockup) {
      fabricCanvas.remove(currentMockup);
      setCurrentMockup(null);
      setActiveMockupObject(null);
    }
    // Clear all objects if switching to a new product template, or general blank
     fabricCanvas.clear();
     if (fabricCanvas.backgroundColor !== '#ffffff') {
        fabricCanvas.backgroundColor = '#ffffff';
     }


    if (template.productType === 'general' || !template.svgString) {
      toast.info(`Switched to ${template.name}. Canvas is blank.`);
      fabricCanvas.renderAll();
      setIsTemplateDrawerOpen(false);
      return;
    }
    
    util.enlivenObjects([], (enlivenedObjects: fabric.Object[]) => {
        // This callback is needed for loadSVGFromString, even if objects array is empty
    }, 'fabric');


    fabric.loadSVGFromString(template.svgString, (objects, options) => {
      if (!objects || objects.length === 0) {
        toast.error("Failed to load SVG for template.");
        return;
      }

      const group = util.groupSVGElements(objects, options) as Group;
      
      group.set({
        left: fabricCanvas.width ? fabricCanvas.width / 2 - (group.width ?? 0) * (group.scaleX ?? 1) / 2 : 50,
        top: fabricCanvas.height ? fabricCanvas.height / 2 - (group.height ?? 0) * (group.scaleY ?? 1) / 2 : 50,
        selectable: true,
        hasControls: true,
        // Add a custom property to identify it as a mockup
        data: { isMockup: true, productType: template.productType },
        name: `${template.productType}_mockup`
      });

      // Find the 'product_body' part to color it
      const productBody = group.getObjects().find(obj => obj.id === 'product_body');
      if (productBody) {
        productBody.set('fill', activeColor);
      } else {
        // Fallback: color the first object if 'product_body' isn't found
        if (group.item(0)) {
            group.item(0).set('fill', activeColor);
        }
      }
      
      fabricCanvas.add(group);
      fabricCanvas.centerObject(group);
      group.setCoords();
      fabricCanvas.setActiveObject(group);
      fabricCanvas.renderAll();
      
      setCurrentMockup(group);
      setActiveMockupObject(group); // Inform DesignCanvas about the active mockup

      toast.success(`Applied template: ${template.name}`);
      setIsTemplateDrawerOpen(false);
    });
  };

  return {
    templates,
    isTemplateDrawerOpen,
    setIsTemplateDrawerOpen,
    applyTemplate,
    currentMockup,
  };
};
