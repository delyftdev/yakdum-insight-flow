
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Check } from 'lucide-react';

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'individual' | 'accounting_firm'>('individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUserTypeSelect = (type: 'individual' | 'accounting_firm') => {
    setUserType(type);
    setStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      company_name: formData.companyName,
      user_type: userType
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to verify your account",
      });
      navigate('/auth');
    }

    setIsLoading(false);
  };

  if (step === 1) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-semibold">Choose your account type</h2>
          <p className="text-gray-600">Select the option that best describes you</p>
        </div>

        <div className="grid gap-4">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              userType === 'individual' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setUserType('individual')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  userType === 'individual' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Individual Business Owner</h3>
                  <p className="text-sm text-gray-600">
                    I manage my own business finances
                  </p>
                </div>
                {userType === 'individual' && (
                  <Check className="w-5 h-5 text-gray-900" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              userType === 'accounting_firm' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setUserType('accounting_firm')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  userType === 'accounting_firm' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Building className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Accounting Firm</h3>
                  <p className="text-sm text-gray-600">
                    I manage finances for multiple clients
                  </p>
                </div>
                {userType === 'accounting_firm' && (
                  <Check className="w-5 h-5 text-gray-900" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={() => handleUserTypeSelect(userType)} 
          className="w-full h-12"
        >
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-semibold">Create your account</h2>
        <p className="text-gray-600">
          {userType === 'individual' 
            ? 'Set up your Yakdum account' 
            : 'Set up your firm\'s Yakdum account'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="border-gray-300 focus:border-gray-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="border-gray-300 focus:border-gray-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">
            {userType === 'individual' ? 'Business Name' : 'Firm Name'}
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="border-gray-300 focus:border-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="border-gray-300 focus:border-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="border-gray-300 focus:border-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="border-gray-300 focus:border-gray-500"
            required
          />
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingFlow;
