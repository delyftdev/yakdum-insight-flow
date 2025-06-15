
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Logo />
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Yakdum ("the Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by these terms, 
                please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Yakdum provides AI-powered financial analysis and accounting insights. The Service includes 
                integration with third-party accounting software and the generation of financial reports 
                and recommendations.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                To use certain features of the Service, you must register for an account. You are responsible for:
              </p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Promptly updating your account information</li>
              </ul>

              <h2>4. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Upload malicious code or content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
              </ul>

              <h2>5. Data and Privacy</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy. By using the Service, 
                you consent to the collection and use of your information as outlined in our Privacy Policy.
              </p>

              <h2>6. Third-Party Integrations</h2>
              <p>
                The Service integrates with third-party applications such as QuickBooks. Your use of 
                these integrations is subject to their respective terms of service and privacy policies.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Yakdum 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall Yakdum be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses.
              </p>

              <h2>9. Service Availability</h2>
              <p>
                We strive to maintain high availability of the Service but cannot guarantee uninterrupted 
                access. We reserve the right to modify, suspend, or discontinue the Service at any time.
              </p>

              <h2>10. Subscription and Billing</h2>
              <p>
                Certain features of the Service require a paid subscription. Billing terms are as follows:
              </p>
              <ul>
                <li>Subscriptions are billed in advance on a recurring basis</li>
                <li>You authorize us to charge your payment method</li>
                <li>Refunds are subject to our refund policy</li>
                <li>We may change subscription fees with notice</li>
              </ul>

              <h2>11. Termination</h2>
              <p>
                You may terminate your account at any time. We may terminate or suspend your account 
                immediately if you breach these terms. Upon termination, your right to use the Service 
                will cease immediately.
              </p>

              <h2>12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes. Your continued use of the Service after such modifications constitutes 
                acceptance of the updated terms.
              </p>

              <h2>13. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the 
                State of California, without regard to its conflict of law provisions.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p>
                Email: <a href="mailto:legal@yakdum.com">legal@yakdum.com</a><br />
                Address: 1234 Innovation Drive, Suite 500, San Francisco, CA 94105
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
