
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, CheckCircle, Link as LinkIcon } from 'lucide-react';
import OAuthSimulation from './OAuthSimulation';

interface Client {
  id?: string;
  name: string;
  email: string;
  business_type: string;
  connections: {
    quickbooks: 'connected' | 'disconnected' | 'connecting';
    xero: 'connected' | 'disconnected' | 'connecting';
  };
}

interface ClientManagementProps {
  onClientsChange: (clients: Client[]) => void;
}

const ClientManagement = ({ onClientsChange }: ClientManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [oauthFlow, setOauthFlow] = useState<{
    clientIndex: number;
    provider: 'quickbooks' | 'xero';
  } | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    business_type: ''
  });

  const addClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in client name and email.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          firm_id: user?.id,
          name: newClient.name,
          email: newClient.email,
          business_type: newClient.business_type
        })
        .select()
        .single();

      if (error) throw error;

      const clientWithConnections: Client = {
        ...data,
        connections: {
          quickbooks: 'disconnected',
          xero: 'disconnected'
        }
      };

      const updatedClients = [...clients, clientWithConnections];
      setClients(updatedClients);
      onClientsChange(updatedClients);
      
      setNewClient({ name: '', email: '', business_type: '' });
      setShowAddForm(false);
      
      toast({
        title: "Client Added",
        description: `${newClient.name} has been added successfully.`
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeClient = async (index: number) => {
    const client = clients[index];
    if (client.id) {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', client.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error removing client:', error);
        toast({
          title: "Error",
          description: "Failed to remove client. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
    onClientsChange(updatedClients);
  };

  const startOAuthFlow = (clientIndex: number, provider: 'quickbooks' | 'xero') => {
    setOauthFlow({ clientIndex, provider });
  };

  const handleOAuthComplete = async (success: boolean) => {
    if (oauthFlow && success) {
      const client = clients[oauthFlow.clientIndex];
      
      try {
        // Save connection to database
        await supabase
          .from('accounting_connections')
          .insert({
            user_id: user?.id,
            client_id: client.id,
            provider: oauthFlow.provider,
            status: 'connected',
            connected_at: new Date().toISOString()
          });

        // Update local state
        const updatedClients = [...clients];
        updatedClients[oauthFlow.clientIndex].connections[oauthFlow.provider] = 'connected';
        setClients(updatedClients);
        onClientsChange(updatedClients);
      } catch (error) {
        console.error('Error saving connection:', error);
      }
    }
    setOauthFlow(null);
  };

  const getConnectionCount = () => {
    return clients.reduce((total, client) => {
      const connected = Object.values(client.connections).filter(status => status === 'connected').length;
      return total + connected;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {clients.map((client, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{client.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClient(index)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{client.email}</p>
                  {client.business_type && (
                    <p className="text-xs text-gray-500">{client.business_type}</p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={client.connections.quickbooks === 'connected' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => startOAuthFlow(index, 'quickbooks')}
                      disabled={client.connections.quickbooks === 'connected'}
                      className="text-xs"
                    >
                      {client.connections.quickbooks === 'connected' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          QB Connected
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3 h-3 mr-1" />
                          Connect QB
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant={client.connections.xero === 'connected' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => startOAuthFlow(index, 'xero')}
                      disabled={client.connections.xero === 'connected'}
                      className="text-xs"
                    >
                      {client.connections.xero === 'connected' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Xero Connected
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3 h-3 mr-1" />
                          Connect Xero
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm ? (
        <Card className="border-2 border-dashed border-delyft-primary">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g., ABC Corp"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@company.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  placeholder="e.g., Retail, Consulting, Manufacturing"
                  value={newClient.business_type}
                  onChange={(e) => setNewClient(prev => ({ ...prev, business_type: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={addClient} disabled={!newClient.name || !newClient.email}>
                  Add Client
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 border-dashed border-gray-300 hover:border-delyft-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </Button>
      )}

      {clients.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Progress Summary</h4>
          <p className="text-sm text-blue-700">
            {clients.length} client{clients.length !== 1 ? 's' : ''} added • {getConnectionCount()} accounting connection{getConnectionCount() !== 1 ? 's' : ''} established
          </p>
          {getConnectionCount() === 0 && (
            <p className="text-xs text-blue-600 mt-1">
              Connect at least one accounting software to proceed
            </p>
          )}
        </div>
      )}

      {oauthFlow && (
        <OAuthSimulation
          provider={oauthFlow.provider}
          onComplete={handleOAuthComplete}
          onCancel={() => setOauthFlow(null)}
        />
      )}
    </div>
  );
};

export default ClientManagement;
