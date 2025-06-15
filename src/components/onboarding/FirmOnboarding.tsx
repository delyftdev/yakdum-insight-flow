
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Building2, Users, UserPlus, Palette, Settings, CheckCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const FirmOnboarding = ({ onComplete }: Props) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const [data, setData] = useState({
    firmSize: '',
    clientCount: '',
    services: [] as string[],
    teamEmails: [''],
    brandColor: '#3b82f6',
    logoUploaded: false,
    clientsImported: false
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

  const addTeamMember = () => {
    setData(prev => ({ ...prev, teamEmails: [...prev.teamEmails, ''] }));
  };

  const updateTeamEmail = (index: number, email: string) => {
    setData(prev => ({
      ...prev,
      teamEmails: prev.teamEmails.map((e, i) => i === index ? email : e)
    }));
  };

  const toggleService = (service: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate API call to save onboarding data
    setTimeout(() => {
      toast({
        title: "Welcome to Delyft.ai for Firms!",
        description: "Your firm dashboard is ready. Start managing clients with AI insights."
      });
      onComplete();
    }, 2000);
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
              <h2 className="text-2xl font-display font-semibold">Tell us about your firm</h2>
              <p className="text-gray-600">Help us customize Delyft.ai for your practice</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firmSize">Firm Size</Label>
                  <select
                    id="firmSize"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm"
                    value={data.firmSize}
                    onChange={(e) => setData(prev => ({ ...prev, firmSize: e.target.value }))}
                  >
                    <option value="">Select size</option>
                    <option value="solo">Solo Practice</option>
                    <option value="2-5">2-5 people</option>
                    <option value="6-25">6-25 people</option>
                    <option value="26+">26+ people</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientCount">Client Count</Label>
                  <select
                    id="clientCount"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm"
                    value={data.clientCount}
                    onChange={(e) => setData(prev => ({ ...prev, clientCount: e.target.value }))}
                  >
                    <option value="">Select range</option>
                    <option value="1-25">1-25 clients</option>
                    <option value="26-100">26-100 clients</option>
                    <option value="101-500">101-500 clients</option>
                    <option value="500+">500+ clients</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Services you provide (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Bookkeeping',
                    'Tax Preparation',
                    'Payroll',
                    'Financial Planning',
                    'Business Consulting',
                    'Audit & Assurance'
                  ].map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={service}
                        checked={data.services.includes(service)}
                        onChange={() => toggleService(service)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={nextStep} 
              disabled={!data.firmSize || !data.clientCount || data.services.length === 0}
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
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-semibold">Invite your team</h2>
              <p className="text-gray-600">Add team members who will use Delyft.ai</p>
            </div>

            <div className="space-y-4">
              {data.teamEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="team@yourfirm.com"
                    value={email}
                    onChange={(e) => updateTeamEmail(index, e.target.value)}
                    className="flex-1"
                  />
                  <select className="h-10 border border-gray-300 rounded-md px-3 text-sm">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addTeamMember}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Another Team Member
              </Button>
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

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-semibold">Brand your workspace</h2>
              <p className="text-gray-600">Customize the look for your firm and clients</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Upload your firm logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        onClick={() => setData(prev => ({ ...prev, logoUploaded: true }))}
                      >
                        Choose File
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
                {data.logoUploaded && (
                  <div className="text-sm text-green-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Logo uploaded successfully</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Choose your brand color</Label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={data.brandColor}
                    onChange={(e) => setData(prev => ({ ...prev, brandColor: e.target.value }))}
                    className="w-12 h-12 rounded-lg border border-gray-300"
                  />
                  <div className="flex-1">
                    <Input
                      value={data.brandColor}
                      onChange={(e) => setData(prev => ({ ...prev, brandColor: e.target.value }))}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
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
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-semibold">Import your clients</h2>
              <p className="text-gray-600">Get started with your existing client base</p>
            </div>

            <div className="grid gap-4">
              <Card className="cursor-pointer transition-all border-2 hover:border-delyft-primary hover:shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Import from CSV</h3>
                      <Button variant="outline" size="sm">
                        Upload File
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Upload a CSV file with client names, emails, and contact info
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer transition-all border-2 hover:border-delyft-primary hover:shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Add manually</h3>
                      <Button variant="outline" size="sm">
                        Add Client
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Start fresh and add clients one by one
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                variant="ghost" 
                onClick={() => setData(prev => ({ ...prev, clientsImported: true }))}
                className="text-delyft-primary"
              >
                Skip for now - I'll add clients later
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-delyft-primary to-delyft-secondary rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold">Your firm is ready!</h2>
              <p className="text-gray-600 text-lg">Welcome to the future of accounting practice management</p>
            </div>

            <Card className="bg-gradient-to-r from-delyft-primary/5 to-delyft-secondary/5 border-delyft-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-delyft-gray-900">What's next:</h3>
                <ul className="space-y-2 text-sm text-delyft-gray-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Connect client QuickBooks and Xero accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Use AI to analyze client financial health</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Generate insights and recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Create white-labeled reports for clients</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button 
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full h-12 text-lg"
            >
              {isLoading ? "Setting up your firm dashboard..." : "Launch Firm Dashboard"}
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

export default FirmOnboarding;
