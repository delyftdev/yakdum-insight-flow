
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone, MessageSquare } from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally send the form data
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <MessageSquare className="w-6 h-6 text-gray-900 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900">Send us a message</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      rows={6} 
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-gray-900 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                  </div>
                  <p className="text-gray-600 mb-2">For general inquiries:</p>
                  <a href="mailto:support@yakdum.com" className="text-gray-900 font-medium hover:underline">
                    support@yakdum.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-gray-900 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Office</h3>
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <p>Yakdum Technologies Inc.</p>
                    <p>1234 Innovation Drive, Suite 501</p>
                    <p>San Francisco, CA 94105</p>
                    <p>United States</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Phone className="w-6 h-6 text-gray-900 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Phone</h3>
                  </div>
                  <p className="text-gray-600 mb-2">Business hours: Mon-Fri, 9AM-6PM PST</p>
                  <a href="tel:+1-555-123-4567" className="text-gray-900 font-medium hover:underline">
                    +1 (555) 123-4567
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Support</h3>
                  <p className="text-gray-300 mb-4">
                    Need immediate help? Our support team typically responds within 24 hours.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-gray-900"
                    onClick={() => window.location.href = 'mailto:support@yakdum.com'}
                  >
                    Email Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
