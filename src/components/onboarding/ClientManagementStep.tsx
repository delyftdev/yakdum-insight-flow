
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, Trash2, Link2 } from 'lucide-react';

interface Client {
  id?: string;
  name: string;
  email: string;
  business_type: string;
  connection_status?: 'connected' | 'disconnected';
  provider?: 'quickbooks' | 'xero';
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const ClientManagementStep = ({ onNext, onPrev }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>({
    name: '',
    email: '',
    business_type: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addClient = () => {
    if (!newClient.name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      ...newClient,
      connection_status: 'disconnected'
    };

    setClients([...clients, client]);
    setNewClient({ name: '', email: '', business_type: '' });
  };

  const removeClient = (index: number) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const connectProvider = async (index: number, provider: 'quickbooks' | 'xero') => {
    const updatedClients = [...clients];
    updatedClients[index] = {
      ...updatedClients[index],
      connection_status: 'connected',
      provider
    };
    setClients(updatedClients);

    toast({
      title: "Connected!",
      description: `Successfully connected to ${provider === 'quickbooks' ? 'QuickBooks Online' : 'Xero'}`
    });
  };

  const saveClientsToDatabase = async () => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Save clients to database
      for (const client of clients) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .insert({
            firm_id: user.id,
            name: client.name,
            email: client.email || null,
            business_type: client.business_type || null
          })
          .select()
          .single();

        if (clientError) throw clientError;

        // Save connection status if connected
        if (client.connection_status === 'connected' && client.provider) {
          const { error: connectionError } = await supabase
            .from('accounting_connections')
            .insert({
              user_id: user.id,
              client_id: clientData.id,
              provider: client.provider,
              status: 'connected',
              connected_at: new Date().toISOString()
            });

          if (connectionError) throw connectionError;
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving clients:', error);
      toast({
        title: "Error",
        description: "Failed to save clients. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (clients.length > 0) {
      const success = await saveClientsToDatabase();
      if (!success) return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-display font-semibold">Add your clients</h2>
        <p className="text-gray-600">Add clients and connect their accounting software</p>
      </div>

      {/* Add New Client Form */}
      <Card className="p-4 border-2 border-dashed border-delyft-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              placeholder="ABC Company"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="contact@abccompany.com"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              placeholder="Restaurant, Retail, etc."
              value={newClient.business_type}
              onChange={(e) => setNewClient({ ...newClient, business_type: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={addClient} className="mt-4 w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </Card>

      {/* Clients List */}
      <div className="space-y-3">
        {clients.map((client, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-delyft-gray-900">{client.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-delyft-gray-600">
                  {client.email && <span>{client.email}</span>}
                  {client.business_type && <span>• {client.business_type}</span>}
                </div>
                {client.connection_status === 'connected' && (
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">
                      Connected to {client.provider === 'quickbooks' ? 'QuickBooks Online' : 'Xero'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {client.connection_status === 'disconnected' ? (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => connectProvider(index, 'quickbooks')}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      QB
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => connectProvider(index, 'xero')}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      Xero
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Connected
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeClient(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-8 text-delyft-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No clients added yet. Add your first client above.</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Saving clients..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default ClientManagementStep;
