
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Building2, User } from 'lucide-react';

interface OnboardingData {
  userType: 'individual' | 'accounting_firm' | '';
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState<OnboardingData>({
    userType: '',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const userData = {
      first_name: data.firstName,
      last_name: data.lastName,
      company_name: data.companyName,
      user_type: data.userType,
      phone: data.phone
    };

    const { error } = await signUp(data.email, data.password, userData);

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account"
      });
      navigate('/');
    }

    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-semibold">Choose your account type</h2>
              <p className="text-gray-600">Tell us how you'll be using Delyft.ai</p>
            </div>
            
            <div className="grid gap-4">
              <Card 
                className={`cursor-pointer transition-all border-2 hover:shadow-md ${
                  data.userType === 'individual' ? 'border-delyft-primary bg-delyft-primary/5' : 'border-gray-200'
                }`}
                onClick={() => updateData('userType', 'individual')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      data.userType === 'individual' ? 'bg-delyft-primary text-white' : 'bg-gray-100'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Individual Business Owner</h3>
                      <p className="text-sm text-gray-600">I own and manage my own business</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all border-2 hover:shadow-md ${
                  data.userType === 'accounting_firm' ? 'border-delyft-primary bg-delyft-primary/5' : 'border-gray-200'
                }`}
                onClick={() => updateData('userType', 'accounting_firm')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      data.userType === 'accounting_firm' ? 'bg-delyft-primary text-white' : 'bg-gray-100'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Accounting Firm</h3>
                      <p className="text-sm text-gray-600">I provide accounting services to clients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={nextStep} 
              disabled={!data.userType}
              className="w-full h-12"
            >
              Continue
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-semibold">Tell us about yourself</h2>
              <p className="text-gray-600">We'll use this information to personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) => updateData('firstName', e.target.value)}
                    className="border-gray-300 focus:border-delyft-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={data.lastName}
                    onChange={(e) => updateData('lastName', e.target.value)}
                    className="border-gray-300 focus:border-delyft-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">
                  {data.userType === 'accounting_firm' ? 'Firm Name' : 'Company Name'}
                </Label>
                <Input
                  id="companyName"
                  value={data.companyName}
                  onChange={(e) => updateData('companyName', e.target.value)}
                  className="border-gray-300 focus:border-delyft-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData('email', e.target.value)}
                  className="border-gray-300 focus:border-delyft-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => updateData('phone', e.target.value)}
                  className="border-gray-300 focus:border-delyft-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep}
                disabled={!data.firstName || !data.lastName || !data.email}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-semibold">Secure your account</h2>
              <p className="text-gray-600">Create a strong password to protect your data</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => updateData('password', e.target.value)}
                  className="border-gray-300 focus:border-delyft-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={data.confirmPassword}
                  onChange={(e) => updateData('confirmPassword', e.target.value)}
                  className="border-gray-300 focus:border-delyft-primary"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!data.password || !data.confirmPassword || isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {renderStep()}
    </div>
  );
};

export default OnboardingFlow;
