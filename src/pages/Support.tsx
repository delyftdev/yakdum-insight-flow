
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Book, MessageCircle, Video, FileText } from 'lucide-react';
import { useState } from 'react';

const Support = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    {
      question: "How do I connect my QuickBooks account?",
      answer: "Go to Setup Completion → Integrations tab and click 'Connect QuickBooks'. Follow the authorization process to link your account."
    },
    {
      question: "What types of financial insights can Yakdum provide?",
      answer: "Yakdum can analyze revenue trends, expense breakdowns, profit margins, cash flow patterns, and provide custom financial reports."
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes, we use bank-level encryption and security measures to protect your data. We never store your actual QuickBooks credentials."
    },
    {
      question: "Can I use Yakdum with multiple clients?",
      answer: "Yes, accounting firms can manage multiple clients and switch between them easily in the platform."
    },
    {
      question: "How accurate are the AI insights?",
      answer: "Our AI provides insights based on your actual financial data and established accounting principles. Always review recommendations with professional judgment."
    }
  ];

  const helpResources = [
    {
      icon: Book,
      title: "Getting Started Guide",
      description: "Learn the basics of using Yakdum",
      action: "View Guide"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials",
      action: "Watch Videos"
    },
    {
      icon: FileText,
      title: "API Documentation",
      description: "Integration and development docs",
      action: "View Docs"
    },
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Connect with other users",
      action: "Join Forum"
    }
  ];

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
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How can we help?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers, get support, and learn how to make the most of Yakdum
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, tutorials, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-gray-300 focus:border-gray-500"
              />
            </div>
          </div>

          {/* Help Resources */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {helpResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <resource.icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <Button variant="outline" size="sm">
                    {resource.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Still need help?</h2>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Support</h3>
                  <p className="text-gray-600 mb-4">
                    Get in touch with our support team for technical assistance or account questions.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Response time:</strong> Within 24 hours
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> <a href="mailto:support@yakdum.com" className="text-gray-900 hover:underline">support@yakdum.com</a>
                    </p>
                    <Button 
                      onClick={() => window.location.href = 'mailto:support@yakdum.com'}
                      className="w-full"
                    >
                      Email Support
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Request</h3>
                  <p className="text-gray-600 mb-4">
                    Have an idea for a new feature? We'd love to hear from you!
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/contact')}
                    className="w-full"
                  >
                    Submit Feature Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Support */}
          <Card className="mt-12 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Critical Issues</h3>
              <p className="text-red-700 mb-4">
                If you're experiencing a critical issue that's preventing you from accessing your data 
                or using essential features, please mark your support email as "URGENT" in the subject line.
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:support@yakdum.com?subject=URGENT: Critical Issue'}
                className="bg-red-600 hover:bg-red-700"
              >
                Report Critical Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
