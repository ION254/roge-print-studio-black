import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Manufacturer {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  specialties: string[];
  minimum_order_quantity: number;
  lead_time_days: number;
  certifications: string[];
  website_url?: string;
  description?: string;
  is_verified: boolean;
}

interface ManufacturerFormProps {
  manufacturer?: Manufacturer | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ManufacturerForm: React.FC<ManufacturerFormProps> = ({
  manufacturer,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: manufacturer?.company_name || '',
    contact_email: manufacturer?.contact_email || user?.email || '',
    contact_phone: manufacturer?.contact_phone || '',
    address: manufacturer?.address || '',
    minimum_order_quantity: manufacturer?.minimum_order_quantity || 50,
    lead_time_days: manufacturer?.lead_time_days || 14,
    website_url: manufacturer?.website_url || '',
    description: manufacturer?.description || '',
  });
  
  const [specialties, setSpecialties] = useState<string[]>(manufacturer?.specialties || []);
  const [certifications, setCertifications] = useState<string[]>(manufacturer?.certifications || []);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setCertifications(certifications.filter(c => c !== certification));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a manufacturer profile');
      return;
    }

    setLoading(true);
    try {
      const manufacturerData = {
        ...formData,
        specialties,
        certifications,
        user_id: user.id,
      };

      if (manufacturer) {
        const { error } = await supabase
          .from('manufacturers')
          .update(manufacturerData)
          .eq('id', manufacturer.id);
        
        if (error) throw error;
        toast.success('Manufacturer profile updated successfully');
      } else {
        const { error } = await supabase
          .from('manufacturers')
          .insert([manufacturerData]);
        
        if (error) throw error;
        toast.success('Manufacturer profile created successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving manufacturer:', error);
      toast.error('Failed to save manufacturer profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {manufacturer ? 'Edit Manufacturer Profile' : 'Create Manufacturer Profile'}
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your manufacturing capabilities and services..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minimum_order_quantity">Minimum Order Quantity</Label>
                <Input
                  id="minimum_order_quantity"
                  type="number"
                  min="1"
                  value={formData.minimum_order_quantity}
                  onChange={(e) => setFormData({ ...formData, minimum_order_quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="lead_time_days">Lead Time (Days)</Label>
                <Input
                  id="lead_time_days"
                  type="number"
                  min="1"
                  value={formData.lead_time_days}
                  onChange={(e) => setFormData({ ...formData, lead_time_days: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label>Specialties</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add a specialty"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {specialty}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeSpecialty(specialty)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Certifications</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add a certification"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <Button type="button" onClick={addCertification} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((certification, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {certification}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeCertification(certification)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : manufacturer ? 'Update Profile' : 'Create Profile'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};