
-- 1) Create chat table for orders
CREATE TABLE public.order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Participants (customer or assigned manufacturer) can view messages on their orders
CREATE POLICY "Participants can view order messages"
ON public.order_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_messages.order_id
      AND (
        o.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.manufacturers m
          WHERE m.user_id = auth.uid()
            AND m.id = o.manufacturer_id
        )
      )
  )
);

-- Policy: Participants can insert messages on their orders and must be the sender
CREATE POLICY "Participants can insert order messages"
ON public.order_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_messages.order_id
      AND (
        o.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.manufacturers m
          WHERE m.user_id = auth.uid()
            AND m.id = o.manufacturer_id
        )
      )
  )
);

-- No UPDATE/DELETE policies: messages immutable by default

-- 2) Enable realtime on order_messages
ALTER TABLE public.order_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;

-- 3) Extend orders table for payments and shipping workflow
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shipping_final_cents INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address JSONB;
