import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AwardCoinsRequest {
  user_id: string;
  transaction_type: 'earned' | 'bonus' | 'referral';
  amount: number;
  description?: string;
  reference_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, transaction_type, amount, description, reference_id }: AwardCoinsRequest = await req.json();

    // Validate required fields
    if (!user_id || !transaction_type || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('roge_transactions')
      .insert({
        user_id,
        transaction_type,
        amount: amount.toString(),
        description: description || `${transaction_type} reward`,
        reference_id
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create transaction' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get updated balance
    const { data: balanceData, error: balanceError } = await supabaseClient
      .rpc('get_user_roge_balance', { user_uuid: user_id });

    if (balanceError) {
      console.error('Error getting balance:', balanceError);
    }

    console.log(`Awarded ${amount} RC to user ${user_id} for ${transaction_type}. New balance: ${balanceData || 'unknown'}`);

    return new Response(
      JSON.stringify({
        transaction,
        new_balance: balanceData || 0,
        message: `Successfully awarded ${amount} RC`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in award-roge-coins function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);