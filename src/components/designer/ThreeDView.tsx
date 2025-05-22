
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { View } from 'lucide-react'; // Changed from View3d to View

interface ThreeDViewProps {
  canvasData?: string; // This would be the serialized canvas data
}

export const ThreeDView: React.FC<ThreeDViewProps> = ({ canvasData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <View className="h-4 w-4" /> {/* Changed from View3d to View */}
          3D Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] min-h-[500px]">
        <DialogHeader>
          <DialogTitle>3D Preview</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
          <p className="text-center text-muted-foreground">
            3D preview will be displayed here.<br />
            <span className="text-sm">(Coming soon)</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

