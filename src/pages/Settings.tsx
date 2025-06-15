
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CollapsiblePanel from '@/components/navigation/CollapsiblePanel';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  phone: string;
  user_type: 'individual' | 'accounting_firm';
}

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CollapsiblePanel userProfile={userProfile} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/chat')} className="text-black hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <h1 className="text-3xl font-bold text-black">Settings</h1>
          </div>

          <div className="grid gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your account preferences and security settings.</p>
                <Button 
                  onClick={() => navigate('/profile')} 
                  className="mt-4 bg-black text-white hover:bg-gray-800"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configure your notification preferences.</p>
                <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your privacy settings and security options.</p>
                <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your connected accounting software and third-party integrations.</p>
                <Button 
                  onClick={() => navigate('/setup-completion')} 
                  variant="outline"
                  className="mt-4 border-gray-200 text-black hover:bg-gray-50"
                >
                  Manage Integrations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
