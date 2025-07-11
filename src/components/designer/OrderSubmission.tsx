import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Canvas as FabricCanvas } from 'fabric';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Package, Clock } from 'lucide-react';

interface Manufacturer {
  id: string;
  company_name: string;
  minimum_order_quantity: number;
  lead_time_days: number;
  specialties: string[];
}

interface OrderSubmissionProps {
  fabricCanvas: FabricCanvas | null;
  measurements: Record<string, number>;
  productType: string;
  onClose: () => void;
}

export const OrderSubmission: React.FC<OrderSubmissionProps> = ({
  fabricCanvas,
  measurements,
  productType,
  onClose,
}) => {
  const { user } = useAuth();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(50);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, company_name, minimum_order_quantity, lead_time_days, specialties')
        .eq('is_verified', true)
        .order('lead_time_days', { ascending: true });

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      toast.error('Failed to load manufacturers');
    }
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error('You must be logged in to submit an order');
      return;
    }

    if (!selectedManufacturer) {
      toast.error('Please select a manufacturer');
      return;
    }

    if (!fabricCanvas) {
      toast.error('No design available to submit');
      return;
    }

    setLoading(true);
    try {
      // Export canvas as JSON and image
      const designJson = fabricCanvas.toJSON();
      const designImage = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 2
      });

      const orderData = {
        customer_id: user.id,
        manufacturer_id: selectedManufacturer,
        design_data: {
          json: designJson,
          image: designImage,
          canvas_dimensions: {
            width: fabricCanvas.width,
            height: fabricCanvas.height
          }
        },
        measurements,
        product_type: productType,
        quantity,
        notes,
        status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      toast.success('Order submitted successfully! The manufacturer will be notified.');
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const selectedManufacturerData = manufacturers.find(m => m.id === selectedManufacturer);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Submit Order to Manufacturer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Select Manufacturer *</Label>
            <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer.id} value={manufacturer.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{manufacturer.company_name}</span>
                      <span className="text-sm text-muted-foreground">
                        Min: {manufacturer.minimum_order_quantity} units • {manufacturer.lead_time_days} days
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedManufacturerData && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    Minimum Order: {selectedManufacturerData.minimum_order_quantity} units
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    Lead Time: {selectedManufacturerData.lead_time_days} days
                  </div>
                  {selectedManufacturerData.specialties.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedManufacturerData.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min={selectedManufacturerData?.minimum_order_quantity || 1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              placeholder="Enter quantity"
            />
            {selectedManufacturerData && quantity < selectedManufacturerData.minimum_order_quantity && (
              <p className="text-sm text-destructive mt-1">
                Minimum order quantity is {selectedManufacturerData.minimum_order_quantity} units
              </p>
            )}
          </div>

          <div>
            <Label>Order Details</Label>
            <div className="bg-muted p-4 rounded-lg space-y-4 text-sm">
              <div><strong>Product Type:</strong> {productType}</div>
              
              {fabricCanvas && (
                <div>
                  <strong>Design Preview:</strong>
                  <div className="mt-2 border rounded overflow-hidden bg-white">
                    <img 
                      src={fabricCanvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.5 })} 
                      alt="Design preview" 
                      className="w-full h-32 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <strong>Measurements:</strong>
                <div className="grid grid-cols-2 gap-2 pl-4 mt-1">
                  {Object.entries(measurements).map(([key, value]) => (
                    <div key={key}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value}cm
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or instructions for the manufacturer..."
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSubmitOrder}
              disabled={loading || !selectedManufacturer || (selectedManufacturerData && quantity < selectedManufacturerData.minimum_order_quantity)}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Order'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};