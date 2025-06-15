
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-lg max-w-none">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This may include:
              </p>
              <ul>
                <li>Name and contact information</li>
                <li>Business information and financial data</li>
                <li>Usage data and preferences</li>
                <li>Communications with our support team</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraud and unauthorized access</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                except as described in this policy. We may share your information:
              </p>
              <ul>
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist our operations</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage practices</li>
              </ul>

              <h2>5. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and fulfill 
                the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of certain communications</li>
                <li>Export your data</li>
              </ul>

              <h2>7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to improve your experience, analyze usage, 
                and provide personalized content. You can control cookie preferences through your browser settings.
              </p>

              <h2>8. Third-Party Integrations</h2>
              <p>
                Our service integrates with third-party applications like QuickBooks. Your use of these 
                integrations is subject to their respective privacy policies and terms of service.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <p>
                Email: <a href="mailto:privacy@yakdum.com">privacy@yakdum.com</a><br />
                Address: 1234 Innovation Drive, Suite 500, San Francisco, CA 94105
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
