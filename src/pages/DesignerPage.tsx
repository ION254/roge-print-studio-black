
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DesignCanvas } from '@/components/designer/DesignCanvas';
import { OrderSubmission } from '@/components/designer/OrderSubmission';
import { useAuth } from '@/contexts/AuthContext';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

const DesignerPage = () => {
  const { user } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [measurements, setMeasurements] = useState<Record<string, number>>({});
  const [productType, setProductType] = useState<string>('');

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error('Please sign in to proceed with checkout');
      return;
    }

    if (!fabricCanvas) {
      toast.error('Please create a design first');
      return;
    }

    // Check if canvas has any user-created content (not just mockup)
    const objects = fabricCanvas.getObjects();
    const hasUserContent = objects.some(obj => !(obj as any).data?.isMockup);
    
    if (!hasUserContent) {
      toast.error('Please add some design elements before checkout');
      return;
    }

    if (!productType) {
      toast.error('Please select a product template first');
      return;
    }

    setIsCheckoutOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Product Designer</h1>
        
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl flex flex-col gap-8">
          <h2 className="text-3xl font-semibold text-foreground text-center">Design Your Product</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Unleash your creativity! Add text, images, drawings, and more to your chosen product.
          </p>
          
          <div className="w-full">
            <DesignCanvas 
              onCanvasReady={setFabricCanvas}
              onMeasurementsChange={setMeasurements}
              onProductTypeChange={setProductType}
            />
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
      
      {isCheckoutOpen && (
        <OrderSubmission
          fabricCanvas={fabricCanvas}
          measurements={measurements}
          productType={productType}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
};

export default DesignerPage;
