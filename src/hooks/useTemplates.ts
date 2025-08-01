
import { useState } from 'react';
import { Canvas as FabricCanvas, Group, Rect, FabricObject, FabricImage } from 'fabric';
import { toast } from 'sonner';
import tshirtBasicImage from '@/assets/template-tshirt-basic.jpg';
import hoodieClassicImage from '@/assets/template-hoodie-classic.jpg';
import capBaseballImage from '@/assets/template-cap-baseball.jpg';
import tshirtVneckImage from '@/assets/template-tshirt-vneck.jpg';
import hoodieZipImage from '@/assets/template-hoodie-zip.jpg';
import tshirtLongsleeveImage from '@/assets/template-tshirt-longsleeve.jpg';

// Custom interfaces for extended properties
interface CustomFabricObject extends FabricObject {
  data?: {
    isMockup?: boolean;
    productType?: string;
  };
  id?: string;
  name?: string;
}

interface CustomGroup extends Group {
  data?: {
    isMockup?: boolean;
    productType?: string;
  };
  id?: string;
  name?: string;
}

// Enhanced Template type definition
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  productType: 't-shirt' | 'hoodie' | 'cap' | 'tank-top' | 'long-sleeve' | 'general';
  svgString?: string;
  designAreas: {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    maxWidth?: number;
    maxHeight?: number;
  }[];
  availableColors: string[];
  popular?: boolean;
  tags: string[];
}

// Enhanced realistic SVG templates with 3D effects
const T_SHIRT_BASIC_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tshirt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#e9ecef;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dee2e6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g id="tshirt-group" filter="url(#shadow)">
    <path id="product_body" d="M75 80 L75 95 L65 105 L65 120 L55 130 L55 260 L245 260 L245 130 L235 120 L235 105 L225 95 L225 80 L210 80 L210 70 Q200 50 180 50 L120 50 Q100 50 90 70 L90 80 Z" 
          fill="url(#tshirt-gradient)" stroke="#adb5bd" stroke-width="1"/>
    <path d="M90 70 Q100 60 120 60 L180 60 Q200 60 210 70" fill="none" stroke="#6c757d" stroke-width="0.5" opacity="0.6"/>
    <rect id="design-area" x="100" y="120" width="100" height="80" fill="none" stroke="#007bff" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  </g>
</svg>`;

const HOODIE_CLASSIC_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hoodie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6c757d;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#495057;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#343a40;stop-opacity:1" />
    </linearGradient>
    <filter id="hoodie-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g id="hoodie-group" filter="url(#hoodie-shadow)">
    <path id="product_body" d="M60 90 L60 105 L50 115 L50 130 L40 140 L40 270 L260 270 L260 140 L250 130 L250 115 L240 105 L240 90 L220 90 L220 75 Q210 45 180 45 L120 45 Q90 45 80 75 L80 90 Z" 
          fill="url(#hoodie-gradient)" stroke="#212529" stroke-width="1"/>
    <ellipse cx="150" cy="65" rx="25" ry="15" fill="#212529" opacity="0.3"/>
    <rect x="120" y="180" width="60" height="25" rx="5" fill="#212529" opacity="0.2"/>
    <rect id="design-area" x="110" y="120" width="80" height="70" fill="none" stroke="#007bff" stroke-width="1" stroke-dasharray="3,3" opacity="0.7"/>
  </g>
</svg>`;

const CAP_BASEBALL_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1d4ed8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
    <filter id="cap-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="1" dy="3" stdDeviation="2" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g id="cap-group" filter="url(#cap-shadow)">
    <ellipse id="product_body" cx="150" cy="130" rx="80" ry="45" fill="url(#cap-gradient)" stroke="#1e40af" stroke-width="1"/>
    <ellipse cx="150" cy="130" rx="60" ry="35" fill="none" stroke="#3b82f6" stroke-width="0.5" opacity="0.6"/>
    <ellipse cx="230" cy="140" rx="40" ry="8" fill="url(#cap-gradient)" stroke="#1e40af" stroke-width="1"/>
    <circle cx="150" cy="115" r="2" fill="#1e40af" opacity="0.8"/>
    <rect id="design-area" x="120" y="110" width="60" height="30" fill="none" stroke="#007bff" stroke-width="1" stroke-dasharray="2,2" opacity="0.8"/>
  </g>
</svg>`;

const VNECK_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vneck-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f8f9fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
    </linearGradient>
  </defs>
  <g id="vneck-group">
    <path id="product_body" d="M75 80 L75 95 L65 105 L65 120 L55 130 L55 260 L245 260 L245 130 L235 120 L235 105 L225 95 L225 80 L210 80 L210 70 L190 70 L150 90 L110 70 L90 70 L90 80 Z" 
          fill="url(#vneck-gradient)" stroke="#adb5bd" stroke-width="1"/>
    <rect id="design-area" x="100" y="130" width="100" height="70" fill="none" stroke="#007bff" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
  </g>
</svg>`;

const LONGSLEEVE_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="longsleeve-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <g id="longsleeve-group">
    <path id="product_body" d="M30 90 L30 240 L75 240 L75 260 L225 260 L225 240 L270 240 L270 90 L240 80 L210 80 L210 70 Q200 50 180 50 L120 50 Q100 50 90 70 L90 80 L60 80 Z" 
          fill="url(#longsleeve-gradient)" stroke="#1d4ed8" stroke-width="1"/>
    <rect id="design-area" x="100" y="120" width="100" height="80" fill="none" stroke="#007bff" stroke-width="1" stroke-dasharray="3,3" opacity="0.7"/>
  </g>
</svg>`;

const ZIP_HOODIE_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="zip-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#212529;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#343a40;stop-opacity:1" />
    </linearGradient>
  </defs>
  <g id="zip-hoodie-group">
    <path id="product_body" d="M60 90 L60 105 L50 115 L50 130 L40 140 L40 270 L260 270 L260 140 L250 130 L250 115 L240 105 L240 90 L220 90 L220 75 Q210 45 180 45 L120 45 Q90 45 80 75 L80 90 Z" 
          fill="url(#zip-gradient)" stroke="#000000" stroke-width="1"/>
    <line x1="150" y1="90" x2="150" y2="270" stroke="#6c757d" stroke-width="2"/>
    <rect x="145" y="100" width="10" height="8" fill="#6c757d"/>
    <rect x="145" y="120" width="10" height="8" fill="#6c757d"/>
    <rect x="145" y="140" width="10" height="8" fill="#6c757d"/>
    <rect id="design-area" x="80" y="120" width="60" height="70" fill="none" stroke="#007bff" stroke-width="1" stroke-dasharray="3,3" opacity="0.7"/>
  </g>
</svg>`;

// Enhanced sample templates with complete data structure
const sampleTemplates: Template[] = [
  {
    id: 'tshirt-basic',
    name: 'Basic T-Shirt',
    category: 'T-Shirts',
    description: 'Classic crew neck t-shirt perfect for everyday designs',
    thumbnail: tshirtBasicImage,
    productType: 't-shirt',
    svgString: T_SHIRT_BASIC_SVG,
    designAreas: [
      {
        id: 'chest',
        name: 'Chest',
        x: 100,
        y: 120,
        width: 100,
        height: 80,
        maxWidth: 120,
        maxHeight: 100
      }
    ],
    availableColors: ['#ffffff', '#000000', '#1f2937', '#3b82f6', '#ef4444', '#10b981'],
    popular: true,
    tags: ['basic', 'classic', 'cotton', 'everyday']
  },
  {
    id: 'tshirt-vneck',
    name: 'V-Neck T-Shirt',
    category: 'T-Shirts',
    description: 'Stylish v-neck design for a modern look',
    thumbnail: tshirtVneckImage,
    productType: 't-shirt',
    svgString: VNECK_SVG,
    designAreas: [
      {
        id: 'chest',
        name: 'Chest',
        x: 100,
        y: 130,
        width: 100,
        height: 70,
        maxWidth: 110,
        maxHeight: 85
      }
    ],
    availableColors: ['#ffffff', '#000000', '#1f2937', '#6b7280'],
    popular: false,
    tags: ['vneck', 'stylish', 'modern', 'fitted']
  },
  {
    id: 'tshirt-longsleeve',
    name: 'Long Sleeve T-Shirt',
    category: 'T-Shirts',
    description: 'Long sleeve comfort for cooler weather',
    thumbnail: tshirtLongsleeveImage,
    productType: 'long-sleeve',
    svgString: LONGSLEEVE_SVG,
    designAreas: [
      {
        id: 'chest',
        name: 'Chest',
        x: 100,
        y: 120,
        width: 100,
        height: 80,
        maxWidth: 120,
        maxHeight: 100
      }
    ],
    availableColors: ['#1e40af', '#000000', '#ffffff', '#1f2937'],
    popular: false,
    tags: ['longsleeve', 'warm', 'casual', 'cotton']
  },
  {
    id: 'hoodie-classic',
    name: 'Classic Hoodie',
    category: 'Hoodies',
    description: 'Comfortable pullover hoodie with front pocket',
    thumbnail: hoodieClassicImage,
    productType: 'hoodie',
    svgString: HOODIE_CLASSIC_SVG,
    designAreas: [
      {
        id: 'chest',
        name: 'Chest',
        x: 110,
        y: 120,
        width: 80,
        height: 70,
        maxWidth: 100,
        maxHeight: 90
      }
    ],
    availableColors: ['#6b7280', '#000000', '#1f2937', '#ffffff', '#3b82f6'],
    popular: true,
    tags: ['hoodie', 'warm', 'casual', 'pocket', 'comfortable']
  },
  {
    id: 'hoodie-zip',
    name: 'Zip-Up Hoodie',
    category: 'Hoodies',
    description: 'Full zip hoodie with hood and front zipper',
    thumbnail: hoodieZipImage,
    productType: 'hoodie',
    svgString: ZIP_HOODIE_SVG,
    designAreas: [
      {
        id: 'left-chest',
        name: 'Left Chest',
        x: 80,
        y: 120,
        width: 60,
        height: 70,
        maxWidth: 80,
        maxHeight: 90
      },
      {
        id: 'right-chest',
        name: 'Right Chest',
        x: 160,
        y: 120,
        width: 60,
        height: 70,
        maxWidth: 80,
        maxHeight: 90
      }
    ],
    availableColors: ['#000000', '#1f2937', '#6b7280', '#3b82f6'],
    popular: false,
    tags: ['zip', 'hoodie', 'jacket', 'warm', 'versatile']
  },
  {
    id: 'cap-baseball',
    name: 'Baseball Cap',
    category: 'Caps',
    description: 'Classic baseball cap with curved brim',
    thumbnail: capBaseballImage,
    productType: 'cap',
    svgString: CAP_BASEBALL_SVG,
    designAreas: [
      {
        id: 'front-panel',
        name: 'Front Panel',
        x: 120,
        y: 110,
        width: 60,
        height: 30,
        maxWidth: 70,
        maxHeight: 40
      }
    ],
    availableColors: ['#1e40af', '#000000', '#ffffff', '#ef4444', '#10b981'],
    popular: true,
    tags: ['cap', 'baseball', 'sport', 'casual', 'adjustable']
  },
  {
    id: 'general-blank',
    name: 'Blank Canvas',
    category: 'General',
    description: 'Start with a completely blank canvas for unlimited creativity',
    thumbnail: '/placeholder.svg',
    productType: 'general',
    designAreas: [],
    availableColors: ['#ffffff'],
    popular: false,
    tags: ['blank', 'custom', 'unlimited', 'creative']
  }
];

export const useTemplates = (
  fabricCanvas: FabricCanvas | null,
  setActiveMockupObject: (obj: CustomFabricObject | CustomGroup | null) => void,
  activeColor: string
) => {
  const [templates] = useState<Template[]>(sampleTemplates);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [currentMockup, setCurrentMockup] = useState<CustomFabricObject | CustomGroup | null>(null);

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

    if (template.productType === 'general') {
      toast.info(`Switched to ${template.name}. Canvas is blank and ready for your creativity!`);
      fabricCanvas.renderAll();
      setIsTemplateDrawerOpen(false);
      return;
    }

    // Load actual product image instead of SVG shapes
    FabricImage.fromURL(template.thumbnail, {
      crossOrigin: 'anonymous'
    }).then((productImage) => {
      // Scale the image to fit nicely on canvas
      const maxWidth = fabricCanvas.width ? fabricCanvas.width * 0.6 : 400;
      const maxHeight = fabricCanvas.height ? fabricCanvas.height * 0.7 : 500;
      
      const imageWidth = productImage.width || 300;
      const imageHeight = productImage.height || 300;
      
      const scaleX = maxWidth / imageWidth;
      const scaleY = maxHeight / imageHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
      
      productImage.set({
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        left: fabricCanvas.width ? fabricCanvas.width / 2 - (imageWidth * scale) / 2 : 50,
        top: fabricCanvas.height ? fabricCanvas.height / 2 - (imageHeight * scale) / 2 : 50,
      });

      // Add custom properties for mockup identification
      const customMockup = Object.assign(productImage, {
        data: { 
          isMockup: true, 
          productType: template.productType,
          templateId: template.id,
          designAreas: template.designAreas
        },
        name: `${template.productType}_mockup`,
        id: 'product_body'
      }) as CustomFabricObject;
      
      fabricCanvas.add(customMockup);
      fabricCanvas.centerObject(customMockup);
      customMockup.setCoords();
      fabricCanvas.setActiveObject(customMockup);
      fabricCanvas.renderAll();
      
      setCurrentMockup(customMockup);
      setActiveMockupObject(customMockup);

      toast.success(`Applied ${template.name} template! Realistic product mockup loaded.`);
    }).catch((error) => {
      console.error('Failed to load product image:', error);
      toast.error('Failed to load product template. Please try again.');
    });
    
    setIsTemplateDrawerOpen(false);
  };

  return {
    templates,
    isTemplateDrawerOpen,
    setIsTemplateDrawerOpen,
    applyTemplate,
    currentMockup,
  };
};
