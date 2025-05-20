import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { toast } from 'sonner';

// Fabric.js type for image loading options might be IImageOptions or a similar name.
// For the purpose of this fix, we'll assume the structure is { crossOrigin: string }.
// If LoadImageOptions is a specific importable type, that would be more robust.
interface LoadImageOptions {
  crossOrigin?: string;
  // other options can be added here if known
}

export const useCanvasImage = (fabricCanvas: FabricCanvas | null) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target?.result as string;
      if (!data) return;

      // Options object passed as the second argument
      const imageOptions: LoadImageOptions = { crossOrigin: 'anonymous' };

      // Callback function passed as the third argument
      FabricImage.fromURL(data, imageOptions, (img) => {
        if (!img) {
          toast.error("Failed to load image onto canvas.");
          return;
        }
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
          hasControls: true,
          hasBorders: true,
        });
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        toast.success("Image added to canvas!");
      });
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return { handleImageUpload };
};
