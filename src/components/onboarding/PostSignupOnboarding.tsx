
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import IndividualOnboarding from './IndividualOnboarding';
import FirmOnboarding from './FirmOnboarding';

interface UserProfile {
  user_type: 'individual' | 'accounting_firm';
  onboarding_completed: boolean;
}

const PostSignupOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('user_type, onboarding_completed')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      navigate('/chat');
      return;
    }

    if (data.onboarding_completed) {
      navigate('/chat');
      return;
    }

    setUserProfile(data);
    setLoading(false);
  };

  const handleOnboardingComplete = async () => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id);

    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-delyft-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {userProfile.user_type === 'individual' ? (
        <IndividualOnboarding onComplete={handleOnboardingComplete} />
      ) : (
        <FirmOnboarding onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default PostSignupOnboarding;
