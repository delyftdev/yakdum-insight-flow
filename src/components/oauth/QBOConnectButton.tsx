
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QBOConnectButtonProps {
  clientId: string;
  clientName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const QBOConnectButton = ({ clientId, clientName, onSuccess, onError }: QBOConnectButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const initiateOAuth = () => {
    setIsConnecting(true);
    
    try {
      // Generate random state for security
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('qbo_oauth_state', state);
      localStorage.setItem('qbo_oauth_client_id', clientId);
      localStorage.setItem('qbo_oauth_client_name', clientName);
      
      // Get QuickBooks client ID from environment
      const QBO_CLIENT_ID = 'ABsmr6Wl1q0oeMOwdVwNne7Ba7adwU1Fz4opLzNzRT6e5b7QyF';
      const redirectUri = `${window.location.origin}/oauth/callback`;
      
      // QuickBooks OAuth URL
      const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
      authUrl.searchParams.append('client_id', QBO_CLIENT_ID);
      authUrl.searchParams.append('scope', 'com.intuit.quickbooks.accounting');
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('state', state);
      
      console.log('Redirecting to QuickBooks OAuth:', authUrl.toString());
      
      // Redirect to QuickBooks
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('OAuth initiation error:', error);
      setIsConnecting(false);
      const errorMessage = 'Failed to initiate QuickBooks connection';
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
      onError?.(errorMessage);
    }
  };

  return (
    <Button
      onClick={initiateOAuth}
      disabled={isConnecting}
      className="bg-[#0077C5] hover:bg-[#005A94] text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
            <span className="text-[#0077C5] font-bold text-xs">QB</span>
          </div>
          <span>Connect QuickBooks</span>
        </>
      )}
    </Button>
  );
};

export default QBOConnectButton;
