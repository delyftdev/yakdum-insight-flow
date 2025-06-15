
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/AppSidebar';
import { Card, CardContent } from '@/components/ui/card';

const Chat = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
                </h1>
                <p className="text-gray-600">
                  {userProfile?.user_type === 'accounting_firm' 
                    ? 'Manage your clients and get AI-powered insights for your practice'
                    : 'Ask questions about your finances and get AI-powered insights'
                  }
                </p>
              </div>

              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">AI Chat Interface Coming Soon</h2>
                    <p className="text-gray-600 mb-6">
                      Your intelligent accounting assistant will be available here to help you with:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <div className="space-y-2">
                        <h3 className="font-medium">Financial Analysis</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Cash flow insights</li>
                          <li>• Expense tracking</li>
                          <li>• Revenue analysis</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Smart Recommendations</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Tax optimization</li>
                          <li>• Business insights</li>
                          <li>• Growth opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
