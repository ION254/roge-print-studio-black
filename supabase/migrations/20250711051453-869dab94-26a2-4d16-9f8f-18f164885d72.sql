-- Add Roge Production as a platform manufacturer
-- Note: Replace the user_id below with the actual user_id after creating the Roge Production user account
-- For now using a placeholder UUID - you'll need to update this with the real user_id

INSERT INTO public.manufacturers (
  user_id,
  company_name,
  contact_email,
  contact_phone,
  address,
  specialties,
  minimum_order_quantity,
  lead_time_days,
  certifications,
  website_url,
  description,
  is_verified
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Placeholder UUID - replace with actual user_id
  'Roge Production',
  'orders@rogeproduction.com',
  '+1-555-ROGE-PRO',
  '123 Manufacturing District, Production City, PC 12345',
  ARRAY['Custom T-Shirts', 'Hoodies', 'Apparel Printing', 'Embroidery', 'Screen Printing', 'Direct-to-Garment', 'Heat Transfer'],
  25,
  7,
  ARRAY['ISO 9001:2015', 'OEKO-TEX Standard 100', 'WRAP Certified', 'Fair Trade Certified'],
  'https://rogeproduction.com',
  'Official Roge platform manufacturing partner specializing in high-quality custom apparel production. With state-of-the-art equipment and eco-friendly processes, we deliver premium results with fast turnaround times for designers and creators.',
  true
);