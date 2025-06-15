
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';
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

const Upgrade = () => {
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

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      features: [
        "Basic AI insights",
        "Up to 5 client connections",
        "Monthly reports",
        "Email support"
      ],
      current: true
    },
    {
      name: "Professional",
      price: "$29",
      period: "month",
      features: [
        "Advanced AI insights",
        "Unlimited client connections",
        "Real-time analytics",
        "Custom reports",
        "Priority support",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      features: [
        "Enterprise AI features",
        "Unlimited everything",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "White-label options"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CollapsiblePanel userProfile={userProfile} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/chat')} className="text-black hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-black">Upgrade Your Plan</h1>
              <p className="text-gray-600 mt-1">Choose the plan that's right for your business</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-gray-200 relative ${plan.popular ? 'ring-2 ring-black' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-black">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-black">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-black mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.current 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : plan.popular 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'border-gray-200 text-black hover:bg-gray-50'
                    }`}
                    variant={plan.current ? 'secondary' : plan.popular ? 'default' : 'outline'}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Need a custom solution?</h2>
            <p className="text-gray-600 mb-6">
              Contact our sales team to discuss enterprise pricing and custom features
            </p>
            <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
