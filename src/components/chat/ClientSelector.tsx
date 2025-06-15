
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Client {
  id: string;
  name: string;
  email: string;
  business_type: string;
}

interface Connection {
  provider: string;
  status: string;
}

interface Props {
  onClientSelect: (client: Client | null) => void;
  selectedClient: Client | null;
}

const ClientSelector = ({ onClientSelect, selectedClient }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [connections, setConnections] = useState<Record<string, Connection>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchClientsAndConnections();
    }
  }, [user]);

  const fetchClientsAndConnections = async () => {
    if (!user) return;

    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('firm_id', user.id);

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch connections for each client
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('accounting_connections')
        .select('client_id, provider, status')
        .eq('user_id', user.id)
        .eq('status', 'connected');

      if (connectionsError) throw connectionsError;

      // Create a map of client_id to connection
      const connectionsMap: Record<string, Connection> = {};
      connectionsData?.forEach(conn => {
        if (conn.client_id) {
          connectionsMap[conn.client_id] = {
            provider: conn.provider,
            status: conn.status
          };
        }
      });
      setConnections(connectionsMap);

    } catch (error) {
      console.error('Error fetching clients and connections:', error);
    }
  };

  const handleClientChange = (clientId: string) => {
    if (clientId === 'all') {
      onClientSelect(null);
    } else {
      const client = clients.find(c => c.id === clientId);
      onClientSelect(client || null);
    }
  };

  const getConnectionStatus = (clientId: string) => {
    const connection = connections[clientId];
    if (connection) {
      return {
        connected: true,
        provider: connection.provider
      };
    }
    return { connected: false, provider: null };
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-delyft-gray-700">Client:</span>
      <Select
        value={selectedClient?.id || 'all'}
        onValueChange={handleClientChange}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {clients.map(client => {
            const { connected, provider } = getConnectionStatus(client.id);
            return (
              <SelectItem key={client.id} value={client.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{client.name}</span>
                  <div className="flex items-center space-x-2 ml-3">
                    {connected && (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">
                          {provider === 'quickbooks' ? 'QB' : 'Xero'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      
      {selectedClient && (
        <div className="flex items-center space-x-2">
          {getConnectionStatus(selectedClient.id).connected ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Ledger Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              No Connection
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
