-- Add pricing fields to the orders table
ALTER TABLE public.orders 
ADD COLUMN currency text NOT NULL DEFAULT 'KSh',
ADD COLUMN printing_method text,
ADD COLUMN base_price_cents integer NOT NULL DEFAULT 0,
ADD COLUMN printing_surcharge_cents integer NOT NULL DEFAULT 0,
ADD COLUMN quantity_discount_cents integer NOT NULL DEFAULT 0,
ADD COLUMN design_coverage_adjustment_cents integer NOT NULL DEFAULT 0,
ADD COLUMN subtotal_cents integer NOT NULL DEFAULT 0,
ADD COLUMN tax_cents integer NOT NULL DEFAULT 0,
ADD COLUMN shipping_cents integer NOT NULL DEFAULT 0,
ADD COLUMN total_cents integer NOT NULL DEFAULT 0,
ADD COLUMN pricing_breakdown jsonb;