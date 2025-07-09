
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { View, AlertCircle } from 'lucide-react';

interface ThreeDViewProps {
  canvasData?: string;
  productType?: 't-shirt' | 'hoodie' | 'cap' | 'general' | string;
}

const MockupPreview: React.FC<{ productType?: string }> = ({ productType }) => {
  const productColors: Record<string, string> = {
    't-shirt': '#e0e0e0',
    'hoodie': '#d0d0d0', 
    'cap': '#c0c0c0',
    'general': '#f0f0f0'
  };

  const productColor = productColors[productType || 'general'] || productColors.general;

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center">
        <div 
          className="w-32 h-40 mx-auto mb-4 rounded-lg shadow-lg transform rotate-y-12"
          style={{ 
            backgroundColor: productColor,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transform: 'perspective(300px) rotateY(15deg)'
          }}
        />
        <h3 className="text-lg font-medium text-gray-700">
          {productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Product'} Preview
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          3D rendering temporarily unavailable
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Showing simplified mockup
        </p>
      </div>
    </div>
  );
};

export const ThreeDView: React.FC<ThreeDViewProps> = ({ canvasData, productType }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <View className="h-4 w-4" />
          3D Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[500px]">
        <DialogHeader>
          <DialogTitle>
            3D Preview - {productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Item'}
          </DialogTitle>
          <DialogDescription>
            Preview your design in a simplified 3D view.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 rounded-md overflow-hidden">
          <MockupPreview productType={productType} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

