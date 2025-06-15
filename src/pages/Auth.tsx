
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ArrowLeft } from 'lucide-react';
import OnboardingFlow from '@/components/auth/OnboardingFlow';
import SignInForm from '@/components/auth/SignInForm';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8 relative">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute left-0 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Logo />
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {mode === 'signin' ? 'Welcome back' : 'Get started'}
              </h1>
              <p className="text-gray-600">
                {mode === 'signin' 
                  ? 'AI-powered accounting insights that work for you' 
                  : 'Create your Yakdum account in minutes'
                }
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {mode === 'signin' ? <SignInForm /> : <OnboardingFlow />}
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
