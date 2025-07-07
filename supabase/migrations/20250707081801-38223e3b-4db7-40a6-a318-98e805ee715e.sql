-- Create manufacturers table
CREATE TABLE public.manufacturers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  specialties TEXT[],
  minimum_order_quantity INTEGER DEFAULT 50,
  lead_time_days INTEGER DEFAULT 14,
  certifications TEXT[],
  website_url TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table to connect customers with manufacturers
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  manufacturer_id UUID,
  design_data JSONB NOT NULL,
  measurements JSONB NOT NULL,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for manufacturers
CREATE POLICY "Users can view all manufacturers" 
ON public.manufacturers 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own manufacturer profile" 
ON public.manufacturers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own manufacturer profile" 
ON public.manufacturers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Manufacturers can view orders assigned to them" 
ON public.orders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.manufacturers 
  WHERE manufacturers.user_id = auth.uid() 
  AND manufacturers.id = orders.manufacturer_id
));

CREATE POLICY "Customers can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Manufacturers can update orders assigned to them" 
ON public.orders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.manufacturers 
  WHERE manufacturers.user_id = auth.uid() 
  AND manufacturers.id = orders.manufacturer_id
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_manufacturers_updated_at
BEFORE UPDATE ON public.manufacturers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();