
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OAuthSimulationProps {
  provider: 'quickbooks' | 'xero';
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

const OAuthSimulation = ({ provider, onComplete, onCancel }: OAuthSimulationProps) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const providerConfig = {
    quickbooks: {
      name: 'QuickBooks Online',
      color: 'bg-green-500',
      logo: 'QB',
      steps: ['Redirecting to QuickBooks', 'Authorizing access', 'Connecting account', 'Finalizing setup']
    },
    xero: {
      name: 'Xero',
      color: 'bg-blue-500',
      logo: 'X',
      steps: ['Redirecting to Xero', 'Authorizing access', 'Connecting account', 'Finalizing setup']
    }
  };

  const config = providerConfig[provider];

  const simulateOAuthFlow = async () => {
    for (let i = 1; i <= 4; i++) {
      setStep(i);
      setProgress((i / 4) * 100);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 90% success rate simulation
    const success = Math.random() > 0.1;
    
    if (success) {
      toast({
        title: `${config.name} Connected!`,
        description: "Your accounting software has been successfully connected.",
      });
      onComplete(true);
    } else {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to your accounting software. Please try again.",
        variant: "destructive"
      });
      onComplete(false);
    }
  };

  React.useEffect(() => {
    simulateOAuthFlow();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 ${config.color} rounded-full flex items-center justify-center mb-4`}>
            <span className="text-white font-bold text-xl">{config.logo}</span>
          </div>
          <CardTitle>Connecting to {config.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {step} of 4</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-3">
            {config.steps.map((stepText, index) => (
              <div key={index} className="flex items-center space-x-3">
                {index + 1 < step ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : index + 1 === step ? (
                  <Loader2 className="w-5 h-5 text-delyft-primary animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className={`text-sm ${index + 1 <= step ? 'text-gray-900' : 'text-gray-500'}`}>
                  {stepText}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Redirecting to {config.name}...</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                You will be redirected to authorize access to your accounting data.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={step > 1}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthSimulation;
