-- Create manufacturer portfolio table
CREATE TABLE public.manufacturer_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.manufacturer_portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Manufacturers can manage their own portfolio" 
ON public.manufacturer_portfolio 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM manufacturers m 
    WHERE m.id = manufacturer_portfolio.manufacturer_id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Everyone can view portfolio items" 
ON public.manufacturer_portfolio 
FOR SELECT 
USING (true);

-- Create storage bucket for manufacturer portfolio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('manufacturer-portfolio', 'manufacturer-portfolio', true);

-- Create storage policies
CREATE POLICY "Manufacturers can upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'manufacturer-portfolio' 
  AND EXISTS (
    SELECT 1 FROM manufacturers m 
    WHERE m.user_id = auth.uid() 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Everyone can view portfolio images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manufacturer-portfolio');

CREATE POLICY "Manufacturers can update their portfolio images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'manufacturer-portfolio' 
  AND EXISTS (
    SELECT 1 FROM manufacturers m 
    WHERE m.user_id = auth.uid() 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Manufacturers can delete their portfolio images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'manufacturer-portfolio' 
  AND EXISTS (
    SELECT 1 FROM manufacturers m 
    WHERE m.user_id = auth.uid() 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_manufacturer_portfolio_updated_at
BEFORE UPDATE ON public.manufacturer_portfolio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();