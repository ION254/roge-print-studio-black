
import React, { useState, Suspense, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { View, RotateCcw, RotateCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Box, Sphere, useTexture } from '@react-three/drei';

interface ThreeDViewProps {
  canvasData?: string; // Data URL of the 2D canvas design
  productType?: 't-shirt' | 'hoodie' | 'cap' | 'general' | string;
}

type ViewAngle = 'front' | 'left' | 'right' | 'top' | 'bottom' | 'back' | 'perspective';

const PlaceholderContent: React.FC<{productType?: string, canvasData?: string}> = ({ productType, canvasData }) => {
  const texture = useTexture(canvasData || '/placeholder.svg'); // Use canvas data as texture

  // Placeholder images for different product types
  const productPlaceholders: Record<string, string> = {
    't-shirt': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60', // T-shirt like image
    'hoodie': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60', // Hoodie like image
    'cap': 'https://images.unsplash.com/photo-1521369909029-2af60d4f7095?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=60', // Cap image
  };

  const placeholderTexture = useTexture(productPlaceholders[productType || 't-shirt'] || productPlaceholders['t-shirt']);


  // Determine which texture to use
  // If canvasData is meaningful (not placeholder), use it. Otherwise, use product-specific placeholder.
  const displayTexture = canvasData && !canvasData.includes('placeholder.svg') ? texture : placeholderTexture;


  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      
      {/* Displaying the 2D canvas design on a plane, or a product placeholder */}
      <Plane args={[3, 3]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
         <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      <Box args={[1, 1.5, 0.2]} position={[0, -0.75, 0]} castShadow>
        <meshStandardMaterial map={displayTexture} roughness={0.7} metalness={0.1} />
      </Box>

      {/* Simple representation of a "mannequin" or stand - a sphere and a cylinder */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0.5, 0]} castShadow>
         <meshStandardMaterial color="lightgray" roughness={0.5}/>
      </Sphere>
       {/* Basic "body" below the Box - could be a cylinder */}
      <mesh position={[0, -1.125, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.75, 32]} />
        <meshStandardMaterial color="darkgray" />
      </mesh>


      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
};


export const ThreeDView: React.FC<ThreeDViewProps> = ({ canvasData, productType }) => {
  const [currentView, setCurrentView] = useState<ViewAngle>('perspective');
  const [isOpen, setIsOpen] = useState(false);

  const viewOptions = [
    { angle: 'perspective' as ViewAngle, label: 'Perspective', icon: View },
    { angle: 'front' as ViewAngle, label: 'Front', icon: View }, // Icons can be more specific
    { angle: 'left' as ViewAngle, label: 'Left', icon: ArrowLeft },
    { angle: 'right' as ViewAngle, label: 'Right', icon: ArrowRight },
    { angle: 'top' as ViewAngle, label: 'Top', icon: ArrowUp },
    { angle: 'bottom' as ViewAngle, label: 'Bottom', icon: ArrowDown },
    { angle: 'back' as ViewAngle, label: 'Back', icon: RotateCw },
  ];

  // Memoize camera positions for different views
  const cameraPositions = useMemo(() => ({
    perspective: [0, 0, 5],
    front: [0, 0, 5],
    left: [-5, 0, 0],
    right: [5, 0, 0],
    top: [0, 5, 0.01], // Small z to avoid gimbal lock issues if looking straight down
    bottom: [0, -5, 0.01],
    back: [0, 0, -5],
  }), []);


  const handleViewChange = (angle: ViewAngle) => {
    setCurrentView(angle);
    // OrbitControls will handle rotation. For fixed views, we might need to reset camera.
    // For now, OrbitControls gives user full control.
    // If we want to force a camera position, we'd update the camera state in the Canvas component.
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <View className="h-4 w-4" />
          3D Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] min-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>3D Preview - {productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Item'} - {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</DialogTitle>
          <DialogDescription>
            Interact with the 3D model. A simple representation is shown. Full mannequin animation is a future enhancement.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 flex-grow min-h-[450px]"> {/* Ensure this area can grow */}
          {/* View Controls */}
          <div className="flex flex-col gap-2 min-w-[140px] py-2 pr-2 border-r">
            <h3 className="text-sm font-medium mb-2">View Angles</h3>
            {viewOptions.map(({ angle, label, icon: Icon }) => (
              <Button
                key={angle}
                variant={currentView === angle ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange(angle)}
                className="justify-start gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
            
            <div className="mt-auto pt-4 border-t"> {/* Pushes quick rotate to bottom */}
              <h4 className="text-sm font-medium mb-2">Quick Rotate</h4>
              <p className="text-xs text-muted-foreground">Use mouse to rotate, scroll to zoom.</p>
              {/* Actual rotation buttons might be redundant with OrbitControls */}
            </div>
          </div>

          {/* 3D Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-muted rounded-md overflow-hidden relative">
            <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading 3D Scene...</span></div>}>
              <Canvas 
                shadows 
                camera={{ position: cameraPositions[currentView] as [number,number,number] || cameraPositions.perspective as [number,number,number], fov: 50 }}
                key={currentView} // Re-mount canvas on view change to reset camera if OrbitControls doesn't handle it perfectly
                className="w-full h-full"
              >
                <PlaceholderContent productType={productType} canvasData={canvasData}/>
              </Canvas>
            </Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

