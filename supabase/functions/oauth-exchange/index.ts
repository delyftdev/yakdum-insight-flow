
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
    const { code, realmId, redirectUri, clientId } = await req.json();

    console.log('OAuth exchange request:', { realmId, redirectUri, clientId });

    const QBO_CLIENT_ID = Deno.env.get('QBO_CLIENT_ID');
    const QBO_CLIENT_SECRET = Deno.env.get('QBO_CLIENT_SECRET');

    if (!QBO_CLIENT_ID || !QBO_CLIENT_SECRET) {
      throw new Error('QuickBooks credentials not configured');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${QBO_CLIENT_ID}:${QBO_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful for company:', realmId);

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update the client record with OAuth tokens
    const { data, error } = await supabase
      .from('clients')
      .update({
        qbo_company_id: realmId,
        qbo_access_token: tokenData.access_token,
        qbo_refresh_token: tokenData.refresh_token,
        qbo_token_expires_at: expiresAt.toISOString(),
        qbo_connected: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId);

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Also update the accounting_connections table
    await supabase
      .from('accounting_connections')
      .upsert({
        client_id: clientId,
        provider: 'quickbooks',
        status: 'connected',
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        companyId: realmId,
        expiresAt: expiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OAuth exchange error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
