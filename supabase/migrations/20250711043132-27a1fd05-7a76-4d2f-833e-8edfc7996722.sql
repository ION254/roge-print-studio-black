-- Create enum for transaction types
CREATE TYPE public.transaction_type AS ENUM ('earned', 'spent', 'withdrawn', 'bonus', 'referral');

-- Create enum for withdrawal status
CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Create enum for blockchain networks
CREATE TYPE public.blockchain_network AS ENUM ('TRC20', 'ERC20', 'ETH', 'BTC');

-- Create roge_transactions table
CREATE TABLE public.roge_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  description TEXT,
  reference_id UUID, -- Can reference orders, designs, etc.
  blockchain_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_wallets table for storing blockchain addresses
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  network blockchain_network NOT NULL,
  wallet_address TEXT NOT NULL,
  wallet_name TEXT, -- User-friendly name for the wallet
  is_verified BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, wallet_address, network)
);

-- Create withdrawal_requests table
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  network blockchain_network NOT NULL,
  wallet_address TEXT NOT NULL,
  status withdrawal_status DEFAULT 'pending',
  network_fee DECIMAL(20, 8),
  final_amount DECIMAL(20, 8), -- Amount after fees
  blockchain_tx_hash TEXT,
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roge_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for roge_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.roge_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions" 
ON public.roge_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for user_wallets
CREATE POLICY "Users can view their own wallets" 
ON public.user_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallets" 
ON public.user_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" 
ON public.user_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets" 
ON public.user_wallets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for withdrawal_requests
CREATE POLICY "Users can view their own withdrawal requests" 
ON public.withdrawal_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests" 
ON public.withdrawal_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to calculate user's total Roge coin balance
CREATE OR REPLACE FUNCTION public.get_user_roge_balance(user_uuid UUID)
RETURNS DECIMAL(20, 8)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    SUM(
      CASE 
        WHEN transaction_type IN ('earned', 'bonus', 'referral') THEN amount
        WHEN transaction_type IN ('spent', 'withdrawn') THEN -amount
        ELSE 0
      END
    ), 0
  )
  FROM public.roge_transactions
  WHERE user_id = user_uuid;
$$;

-- Create function to get pending withdrawal amount
CREATE OR REPLACE FUNCTION public.get_pending_withdrawals(user_uuid UUID)
RETURNS DECIMAL(20, 8)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM public.withdrawal_requests
  WHERE user_id = user_uuid 
  AND status IN ('pending', 'processing');
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_roge_transactions_updated_at
BEFORE UPDATE ON public.roge_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_wallets_updated_at
BEFORE UPDATE ON public.user_wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();