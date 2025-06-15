
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MessageCircle, Book, Mail } from 'lucide-react';
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

const Help = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const faqs = [
    {
      question: "How do I connect my accounting software?",
      answer: "Go to Setup Completion in your profile menu and navigate to the Integrations tab. Click 'Connect' next to your accounting software."
    },
    {
      question: "Can I manage multiple clients?",
      answer: "Yes, if you're an accounting firm, you can add and manage multiple clients through the onboarding process or in your settings."
    },
    {
      question: "How secure is my financial data?",
      answer: "We use enterprise-grade encryption and follow industry best practices to keep your data secure. We never store your actual financial data, only insights."
    },
    {
      question: "What accounting software do you support?",
      answer: "We currently support QuickBooks Online and Xero, with more integrations coming soon."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CollapsiblePanel userProfile={userProfile} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/chat')} className="text-black hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-black">Help & Support</h1>
              <p className="text-gray-600 mt-1">Find answers to your questions</p>
            </div>
          </div>

          {/* Search */}
          <Card className="border-gray-200 mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-black"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-gray-200">
              <CardContent className="pt-6 text-center">
                <MessageCircle className="w-8 h-8 text-black mx-auto mb-4" />
                <h3 className="font-semibold text-black mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-4">Get instant help from our support team</p>
                <Button className="bg-black text-white hover:bg-gray-800">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 text-black mx-auto mb-4" />
                <h3 className="font-semibold text-black mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-4">Send us an email and we'll respond within 24 hours</p>
                <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6 text-center">
                <Book className="w-8 h-8 text-black mx-auto mb-4" />
                <h3 className="font-semibold text-black mb-2">Documentation</h3>
                <p className="text-gray-600 text-sm mb-4">Browse our comprehensive guides and tutorials</p>
                <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-black mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
