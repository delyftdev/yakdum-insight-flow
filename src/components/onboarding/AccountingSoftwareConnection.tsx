
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import OAuthSimulation from './OAuthSimulation';

interface AccountingSoftwareConnectionProps {
  onConnectionChange: (connected: boolean) => void;
}

const AccountingSoftwareConnection = ({ onConnectionChange }: AccountingSoftwareConnectionProps) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState({
    quickbooks: false,
    xero: false
  });
  const [oauthFlow, setOauthFlow] = useState<'quickbooks' | 'xero' | null>(null);

  const startOAuthFlow = (provider: 'quickbooks' | 'xero') => {
    setOauthFlow(provider);
  };

  const handleOAuthComplete = async (success: boolean) => {
    if (oauthFlow && success) {
      try {
        // Save connection to database
        await supabase
          .from('accounting_connections')
          .insert({
            user_id: user?.id,
            provider: oauthFlow,
            status: 'connected',
            connected_at: new Date().toISOString()
          });

        // Update local state
        const updatedConnections = {
          ...connections,
          [oauthFlow]: true
        };
        setConnections(updatedConnections);
        onConnectionChange(updatedConnections.quickbooks || updatedConnections.xero);
      } catch (error) {
        console.error('Error saving connection:', error);
      }
    }
    setOauthFlow(null);
  };

  return (
    <div className="space-y-4">
      <Card className={`cursor-pointer transition-all border-2 hover:shadow-md ${connections.quickbooks ? 'border-green-500 bg-green-50' : 'hover:border-delyft-primary'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">QB</span>
              </div>
              <div>
                <h3 className="font-semibold">QuickBooks Online</h3>
                <p className="text-sm text-gray-600">
                  {connections.quickbooks ? 'Successfully connected' : 'Most popular choice for small businesses'}
                </p>
              </div>
            </div>
            {connections.quickbooks ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => startOAuthFlow('quickbooks')}
              >
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={`cursor-pointer transition-all border-2 hover:shadow-md ${connections.xero ? 'border-green-500 bg-green-50' : 'hover:border-delyft-primary'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">X</span>
              </div>
              <div>
                <h3 className="font-semibold">Xero</h3>
                <p className="text-sm text-gray-600">
                  {connections.xero ? 'Successfully connected' : 'Beautiful cloud-based accounting'}
                </p>
              </div>
            </div>
            {connections.xero ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => startOAuthFlow('xero')}
              >
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {(connections.quickbooks || connections.xero) && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {connections.quickbooks && connections.xero 
                ? 'Both accounting systems connected!'
                : 'Accounting software connected successfully!'}
            </span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Your financial data will be automatically synced and analyzed.
          </p>
        </div>
      )}

      {oauthFlow && (
        <OAuthSimulation
          provider={oauthFlow}
          onComplete={handleOAuthComplete}
          onCancel={() => setOauthFlow(null)}
        />
      )}
    </div>
  );
};

export default AccountingSoftwareConnection;
