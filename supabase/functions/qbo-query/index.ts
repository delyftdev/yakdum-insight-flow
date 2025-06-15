
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { companyId, query } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get tokens from database
    const { data: client, error } = await supabase
      .from('clients')
      .select('qbo_access_token, qbo_refresh_token, qbo_token_expires_at')
      .eq('qbo_company_id', companyId)
      .single();

    if (error || !client) {
      throw new Error('Client not found');
    }

    // Check if token needs refresh
    const now = new Date();
    const expiresAt = new Date(client.qbo_token_expires_at);
    
    let accessToken = client.qbo_access_token;
    
    if (now >= expiresAt) {
      // Refresh token using our edge function
      const refreshResponse = await fetch(`${supabaseUrl}/functions/v1/oauth-refresh`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          refreshToken: client.qbo_refresh_token,
          companyId: companyId
        })
      });
      
      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed');
      }
      
      const refreshData = await refreshResponse.json();
      accessToken = refreshData.accessToken;
    }

    // Make API call to QuickBooks (using sandbox for now)
    const qboResponse = await fetch(
      `https://sandbox-quickbooks.api.intuit.com/v1/company/${companyId}/${query}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!qboResponse.ok) {
      throw new Error(`QBO API error: ${qboResponse.statusText}`);
    }

    const data = await qboResponse.json();
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('QBO query error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
