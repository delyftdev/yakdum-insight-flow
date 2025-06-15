import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Building2, Link, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import AccountingSoftwareConnection from './AccountingSoftwareConnection';

interface Props {
  onComplete: () => void;
}

const IndividualOnboarding = ({ onComplete }: Props) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const [data, setData] = useState({
    businessType: '',
    annualRevenue: '',
    employees: '',
    challenges: [] as string[],
    accountingConnected: false
  });

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

  const handleConnectionChange = (connected: boolean) => {
    setData(prev => ({ ...prev, accountingConnected: connected }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate API call to save onboarding data
    setTimeout(() => {
      toast({
        title: "Welcome to Delyft.ai!",
        description: "Your account is ready. Let's start analyzing your finances."
      });
      onComplete();
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-semibold">Tell us about your business</h2>
              <p className="text-gray-600">Help us personalize your Delyft.ai experience</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">What type of business do you run?</Label>
                <Input
                  id="businessType"
                  placeholder="e.g., E-commerce, Consulting, Restaurant"
                  value={data.businessType}
                  onChange={(e) => setData(prev => ({ ...prev, businessType: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <select
                    id="annualRevenue"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm"
                    value={data.annualRevenue}
                    onChange={(e) => setData(prev => ({ ...prev, annualRevenue: e.target.value }))}
                  >
                    <option value="">Select range</option>
                    <option value="0-50k">$0 - $50k</option>
                    <option value="50k-250k">$50k - $250k</option>
                    <option value="250k-1m">$250k - $1M</option>
                    <option value="1m+">$1M+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <select
                    id="employees"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm"
                    value={data.employees}
                    onChange={(e) => setData(prev => ({ ...prev, employees: e.target.value }))}
                  >
                    <option value="">Select</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2-5</option>
                    <option value="6-25">6-25</option>
                    <option value="26+">26+</option>
                  </select>
                </div>
              </div>
            </div>

            <Button 
              onClick={nextStep} 
              disabled={!data.businessType || !data.annualRevenue || !data.employees}
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
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-4">
                <Link className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-semibold">Connect your accounting software</h2>
              <p className="text-gray-600">We'll securely connect to get real-time insights</p>
            </div>

            <AccountingSoftwareConnection onConnectionChange={handleConnectionChange} />

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep}
                disabled={!data.accountingConnected}
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
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-semibold">Ask your first question</h2>
              <p className="text-gray-600">Try one of these common questions or ask your own</p>
            </div>

            <div className="grid gap-3">
              {[
                "What's my cash flow looking like this month?",
                "Which expenses are growing the fastest?",
                "How does my revenue compare to last year?",
                "What are my biggest tax deductions?"
              ].map((question, index) => (
                <Card key={index} className="cursor-pointer transition-all hover:shadow-md hover:border-delyft-primary">
                  <CardContent className="p-4">
                    <p className="text-sm">{question}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button onClick={nextStep} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold">You're all set!</h2>
              <p className="text-gray-600 text-lg">Your AI accounting assistant is ready to help</p>
            </div>

            <Card className="bg-gradient-to-r from-delyft-primary/5 to-delyft-secondary/5 border-delyft-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-delyft-gray-900">What you can do now:</h3>
                <ul className="space-y-2 text-sm text-delyft-gray-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Ask questions about your finances in plain English</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Get real-time insights and recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Track cash flow and expense trends</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Prepare for tax season with smart categorization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button 
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full h-12 text-lg"
            >
              {isLoading ? "Setting up your dashboard..." : "Start Using Delyft.ai"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndividualOnboarding;
