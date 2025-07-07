import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Package, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ManufacturerForm } from '@/components/manufacturers/ManufacturerForm';
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

const ManufacturersPage = () => {
  const { user } = useAuth();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [userManufacturer, setUserManufacturer] = useState<Manufacturer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManufacturers();
    if (user) {
      fetchUserManufacturer();
    }
  }, [user]);

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      toast.error('Failed to load manufacturers');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserManufacturer = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setUserManufacturer(data);
    } catch (error) {
      console.error('Error fetching user manufacturer:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchManufacturers();
    fetchUserManufacturer();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading manufacturers...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Manufacturing Partners
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with verified manufacturers who can bring your custom designs to life with precision and quality.
            </p>
            
            {user && (
              <div className="flex justify-center gap-4">
                {!userManufacturer ? (
                  <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Become a Manufacturing Partner
                  </Button>
                ) : (
                  <Button onClick={() => setShowForm(true)} variant="outline" size="lg">
                    Edit Your Profile
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Manufacturer Form Modal */}
          {showForm && (
            <ManufacturerForm
              manufacturer={userManufacturer}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Manufacturers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map((manufacturer) => (
              <Card key={manufacturer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {manufacturer.company_name}
                        {manufacturer.is_verified && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {manufacturer.description || 'Custom manufacturing services'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {manufacturer.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {manufacturer.address}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {manufacturer.lead_time_days} days lead time
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Min order: {manufacturer.minimum_order_quantity} units
                  </div>

                  {manufacturer.specialties.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {manufacturer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {manufacturer.certifications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {manufacturer.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      Contact Manufacturer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {manufacturers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No manufacturers found. Be the first to join our platform!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManufacturersPage;