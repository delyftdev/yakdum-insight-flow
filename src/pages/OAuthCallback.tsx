
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const realmId = urlParams.get('realmId');
        
        console.log('OAuth callback params:', { code: !!code, state, realmId });
        
        // Verify state parameter
        const savedState = localStorage.getItem('qbo_oauth_state');
        if (state !== savedState) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }
        
        if (!code || !realmId) {
          throw new Error('Missing required OAuth parameters');
        }
        
        const clientId = localStorage.getItem('qbo_oauth_client_id');
        const clientName = localStorage.getItem('qbo_oauth_client_name');
        
        if (!clientId) {
          throw new Error('Missing client ID from OAuth flow');
        }
        
        const redirectUri = `${window.location.origin}/oauth/callback`;
        
        // Exchange code for tokens using our edge function
        const { data, error } = await supabase.functions.invoke('oauth-exchange', {
          body: { 
            code, 
            realmId,
            redirectUri,
            clientId
          }
        });
        
        if (error) {
          console.error('OAuth exchange error:', error);
          throw new Error(error.message || 'Token exchange failed');
        }
        
        console.log('OAuth exchange successful:', data);
        
        // Clean up localStorage
        localStorage.removeItem('qbo_oauth_state');
        localStorage.removeItem('qbo_oauth_client_id');
        localStorage.removeItem('qbo_oauth_client_name');
        
        setStatus('success');
        
        toast({
          title: "Success!",
          description: `${clientName || 'Client'} has been connected to QuickBooks`,
        });
        
        // Redirect back to setup completion
        setTimeout(() => {
          navigate('/setup-completion?tab=integrations&connected=quickbooks');
        }, 2000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : 'Failed to connect to QuickBooks',
          variant: "destructive"
        });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Connecting to QuickBooks...</h2>
            <p className="text-gray-600">Please wait while we set up your connection</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-800">Successfully Connected!</h2>
            <p className="text-gray-600">Your QuickBooks integration is now active. Redirecting you back to the app...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">Connection Failed</h2>
            <p className="text-gray-600 mb-4">There was an error connecting to QuickBooks. Please try again.</p>
            <Button 
              onClick={() => navigate('/setup-completion?tab=integrations')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Setup
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
