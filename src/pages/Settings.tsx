
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Palette, Link as LinkIcon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully."
      });
      setUserProfile(prev => ({ ...prev, ...updates }));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-delyft-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar userProfile={userProfile} />
        <SidebarInset className="flex-1">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Settings</h1>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Personal Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={userProfile?.first_name || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, first_name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={userProfile?.last_name || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, last_name: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={userProfile?.email || ''}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userProfile?.phone || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <Button 
                        onClick={() => updateProfile({
                          first_name: userProfile?.first_name,
                          last_name: userProfile?.last_name,
                          phone: userProfile?.phone
                        })}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="business">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5" />
                        <span>Business Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountType">Account Type</Label>
                        <Input
                          id="accountType"
                          value={userProfile?.user_type === 'accounting_firm' ? 'Accounting Firm' : 'Individual Business'}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Account type cannot be changed</p>
                      </div>

                      {userProfile?.user_type === 'accounting_firm' && (
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Firm Name</Label>
                          <Input
                            id="companyName"
                            value={userProfile?.company_name || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, company_name: e.target.value }))}
                            placeholder="Your Accounting Firm LLC"
                          />
                        </div>
                      )}

                      <Button 
                        onClick={() => updateProfile({
                          company_name: userProfile?.company_name
                        })}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5" />
                        <span>Connected Integrations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Integration management coming soon</p>
                        <p className="text-sm text-gray-400">
                          You'll be able to manage your QuickBooks and Xero connections here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="branding">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="w-5 h-5" />
                        <span>Branding & Appearance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Branding customization coming soon</p>
                        <p className="text-sm text-gray-400">
                          You'll be able to customize colors, logos, and themes here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
