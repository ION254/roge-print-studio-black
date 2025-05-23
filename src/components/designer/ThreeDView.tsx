
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { View, RotateCcw, RotateCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ThreeDViewProps {
  canvasData?: string;
}

type ViewAngle = 'front' | 'left' | 'right' | 'top' | 'bottom' | 'back';

export const ThreeDView: React.FC<ThreeDViewProps> = ({ canvasData }) => {
  const [currentView, setCurrentView] = useState<ViewAngle>('front');

  const viewOptions = [
    { angle: 'front' as ViewAngle, label: 'Front', icon: View },
    { angle: 'left' as ViewAngle, label: 'Left', icon: ArrowLeft },
    { angle: 'right' as ViewAngle, label: 'Right', icon: ArrowRight },
    { angle: 'top' as ViewAngle, label: 'Top', icon: ArrowUp },
    { angle: 'bottom' as ViewAngle, label: 'Bottom', icon: ArrowDown },
    { angle: 'back' as ViewAngle, label: 'Back', icon: RotateCw },
  ];

  const handleViewChange = (angle: ViewAngle) => {
    setCurrentView(angle);
    // Here you would implement the actual 3D view rotation logic
    console.log(`Switching to ${angle} view`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <View className="h-4 w-4" />
          3D Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] min-h-[600px]">
        <DialogHeader>
          <DialogTitle>3D Preview - {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 h-[500px]">
          {/* View Controls */}
          <div className="flex flex-col gap-2 min-w-[120px]">
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
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Quick Rotate</h4>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" title="Rotate Left">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" title="Rotate Right">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 3D Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-muted rounded-md">
            <div className="text-center text-muted-foreground">
              <View className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">3D Preview - {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</p>
              <p className="text-sm mt-2">
                3D rendering will be displayed here.<br />
                <span className="text-xs">(Coming soon)</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
