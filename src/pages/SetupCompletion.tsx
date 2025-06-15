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
import { ArrowLeft, CheckCircle2, User, Palette, CreditCard, Link2, Upload, Building2, Trash2, AlertTriangle } from 'lucide-react';
import CollapsiblePanel from '@/components/navigation/CollapsiblePanel';
import QBOConnectButton from '@/components/oauth/QBOConnectButton';

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
  const [brandColor, setBrandColor] = useState('#000000');

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
        .select('id, first_name, last_name, email, company_name, phone, user_type, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      // Fetch clients if accounting firm - only select existing columns
      if (profile.user_type === 'accounting_firm') {
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name, email, business_type')
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
    );
    
    if (!confirmed) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted"
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    }
  };

  const handleAddPaymentMethod = () => {
    // For now, redirect to upgrade page which will handle Stripe integration
    navigate('/upgrade');
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

  const handleConnectionSuccess = () => {
    fetchData(); // Refresh data after successful connection
    toast({
      title: "Success!",
      description: "QuickBooks has been connected successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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
              <h1 className="text-3xl font-display font-bold text-gray-900">Setup Completion</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and integrations</p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-green-600">{getCompletionPercentage()}% Complete</span>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
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
              <div className="space-y-6">
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

                {/* Delete Account Section */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Account</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appearance">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Customization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Company Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Logo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Brand Color</Label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="color"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300"
                        />
                        <Input
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                        <Button onClick={() => toast({ title: "Saved", description: "Brand color updated" })}>Save</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Payment Method</h3>
                      <p className="text-sm text-gray-600">Add a payment method to enable premium features</p>
                    </div>
                    <Button onClick={handleAddPaymentMethod}>
                      Add Payment Method
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Secure payments powered by Stripe
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="space-y-6">
                {userProfile.user_type === 'accounting_firm' && clients.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Accounting Software Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {clients.map(client => {
                          const clientConnections = connections.filter(c => c.client?.id === client.id);
                          const qboConnected = clientConnections.some(c => c.provider === 'quickbooks' && c.status === 'connected');
                          
                          return (
                            <div key={client.id} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{client.name}</h4>
                                  <p className="text-sm text-gray-600">{client.email}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                {/* QuickBooks Online */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                      <span className="text-green-600 font-bold text-xs">QB</span>
                                    </div>
                                    <span className="text-sm font-medium">QuickBooks Online</span>
                                  </div>
                                  {qboConnected ? (
                                    <Badge className="bg-green-100 text-green-700">
                                      Connected
                                    </Badge>
                                  ) : (
                                    <QBOConnectButton 
                                      clientId={client.id}
                                      clientName={client.name}
                                      onSuccess={handleConnectionSuccess}
                                    />
                                  )}
                                </div>

                                {/* Xero - Coming Soon */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                      <span className="text-blue-600 font-bold text-xs">X</span>
                                    </div>
                                    <span className="text-sm font-medium">Xero</span>
                                  </div>
                                  <Badge variant="secondary">
                                    Coming Soon
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Accounting Software Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* QuickBooks Online for Individual */}
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
                              <Badge className="bg-green-100 text-green-700">
                                Connected
                              </Badge>
                            ) : (
                              <QBOConnectButton 
                                clientId={userProfile.id}
                                clientName="Your Business"
                                onSuccess={handleConnectionSuccess}
                              />
                            )}
                          </div>
                        </div>

                        {/* Xero - Coming Soon */}
                        <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold">X</span>
                            </div>
                            <div>
                              <h3 className="font-semibold">Xero</h3>
                              <p className="text-sm text-gray-600">Beautiful business accounting</p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            Coming Soon
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SetupCompletion;
