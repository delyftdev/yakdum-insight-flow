
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, User } from 'lucide-react';
import CollapsiblePanel from '@/components/navigation/CollapsiblePanel';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  phone: string;
  user_type: 'individual' | 'accounting_firm';
  logo_url?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      toast({
        title: "Error",
        description: "Failed to load profile",
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      await updateProfile({ logo_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
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
    <div className="min-h-screen bg-white">
      <CollapsiblePanel userProfile={userProfile} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/chat')} className="text-black hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <h1 className="text-3xl font-bold text-black">Profile Settings</h1>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {userProfile.logo_url ? (
                    <img src={userProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <Label htmlFor="logo-upload" className="text-black">Company Logo</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="border-gray-200 text-black hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-black">First Name</Label>
                  <Input
                    id="firstName"
                    value={userProfile.first_name || ''}
                    onChange={(e) => setUserProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                    onBlur={(e) => updateProfile({ first_name: e.target.value })}
                    className="border-gray-200 focus:border-black"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-black">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userProfile.last_name || ''}
                    onChange={(e) => setUserProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                    onBlur={(e) => updateProfile({ last_name: e.target.value })}
                    className="border-gray-200 focus:border-black"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-black">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email || ''}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-black">Company Name</Label>
                <Input
                  id="company"
                  value={userProfile.company_name || ''}
                  onChange={(e) => setUserProfile(prev => prev ? {...prev, company_name: e.target.value} : null)}
                  onBlur={(e) => updateProfile({ company_name: e.target.value })}
                  className="border-gray-200 focus:border-black"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-black">Phone</Label>
                <Input
                  id="phone"
                  value={userProfile.phone || ''}
                  onChange={(e) => setUserProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                  onBlur={(e) => updateProfile({ phone: e.target.value })}
                  className="border-gray-200 focus:border-black"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
