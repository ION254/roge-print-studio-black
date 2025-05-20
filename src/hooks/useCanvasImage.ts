
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { toast } from 'sonner';

export const useCanvasImage = (fabricCanvas: FabricCanvas | null) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target?.result as string;
      if (!data) return;

      FabricImage.fromURL(data, (img) => {
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
      }, { crossOrigin: 'anonymous' });
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return { handleImageUpload };
};
