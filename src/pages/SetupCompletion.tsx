
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle2, AlertCircle, Settings, User, Palette, CreditCard, Link2 } from 'lucide-react';
import CollapsiblePanel from '@/components/navigation/CollapsiblePanel';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  phone: string;
  user_type: 'individual' | 'accounting_firm';
  onboarding_completed: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  business_type: string;
}

interface Connection {
  id: string;
  provider: string;
  status: string;
  connected_at: string;
  client?: Client;
}

const SetupCompletion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      // Fetch clients if accounting firm
      if (profile.user_type === 'accounting_firm') {
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .eq('firm_id', user.id);

        if (clientsError) throw clientsError;
        setClients(clientsData || []);
      }

      // Fetch accounting connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('accounting_connections')
        .select(`
          *,
          clients(id, name, email, business_type)
        `)
        .eq('user_id', user.id);

      if (connectionsError) throw connectionsError;
      setConnections(connectionsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load setup information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const getCompletionPercentage = () => {
    if (!userProfile) return 0;
    
    let completed = 0;
    let total = 5;

    if (userProfile.first_name && userProfile.last_name) completed++;
    if (userProfile.email) completed++;
    if (userProfile.company_name || userProfile.user_type === 'individual') completed++;
    if (userProfile.onboarding_completed) completed++;
    if (connections.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-delyft-primary"></div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-delyft-gray-50 via-white to-delyft-primary-light/20">
      <CollapsiblePanel userProfile={userProfile} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/chat')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-delyft-gray-900">Setup Completion</h1>
              <p className="text-delyft-gray-600 mt-1">Manage your account settings and integrations</p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-green-600">{getCompletionPercentage()}% Complete</span>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="account">
                <Settings className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="integrations">
                <Link2 className="w-4 h-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userProfile.first_name || ''}
                        onChange={(e) => setUserProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                        onBlur={(e) => updateProfile({ first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userProfile.last_name || ''}
                        onChange={(e) => setUserProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                        onBlur={(e) => updateProfile({ last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={userProfile.company_name || ''}
                      onChange={(e) => setUserProfile(prev => prev ? {...prev, company_name: e.target.value} : null)}
                      onBlur={(e) => updateProfile({ company_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone || ''}
                      onChange={(e) => setUserProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      onBlur={(e) => updateProfile({ phone: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accounting Software Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* QuickBooks Online */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold">QB</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">QuickBooks Online</h3>
                            <p className="text-sm text-gray-600">Cloud-based accounting</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {connections.some(c => c.provider === 'quickbooks' && c.status === 'connected') ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline">Disconnected</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            {connections.some(c => c.provider === 'quickbooks' && c.status === 'connected') ? 'Reconnect' : 'Connect'}
                          </Button>
                        </div>
                      </div>

                      {/* Xero */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">X</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Xero</h3>
                            <p className="text-sm text-gray-600">Beautiful business accounting</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {connections.some(c => c.provider === 'xero' && c.status === 'connected') ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline">Disconnected</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            {connections.some(c => c.provider === 'xero' && c.status === 'connected') ? 'Reconnect' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Connections (for firms) */}
                {userProfile.user_type === 'accounting_firm' && clients.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {clients.map(client => {
                          const clientConnections = connections.filter(c => c.client?.id === client.id);
                          return (
                            <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{client.name}</h4>
                                <p className="text-sm text-gray-600">{client.email}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {clientConnections.length > 0 ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-green-600">
                                      Connected to {clientConnections[0].provider}
                                    </span>
                                  </div>
                                ) : (
                                  <Badge variant="outline">No connections</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Appearance customization options coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Additional account settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Billing management coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SetupCompletion;
