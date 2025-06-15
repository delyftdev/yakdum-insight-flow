
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, TrendingUp, Clock, BarChart3 } from 'lucide-react';

const About = () => {
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Yakdum
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Transforming the way accountants and business owners work with financial data
            </p>
          </div>

          {/* Story Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-4">
                  We noticed something that many in the industry had been feeling for years: accountants were spending 
                  countless hours manually gathering insights from their clients' books. What should have been strategic 
                  analysis time was being consumed by repetitive data extraction and basic reporting tasks.
                </p>
                <p className="mb-4">
                  Watching talented accounting professionals spend 60-70% of their time on manual data work instead of 
                  providing valuable business insights wasn't just inefficient—it was preventing them from delivering 
                  the strategic value their clients truly needed.
                </p>
                <p className="mb-4">
                  That's when we realized AI could change everything. What if accountants could simply ask questions 
                  about their clients' financial data and get instant, accurate insights? What if generating comprehensive 
                  reports took minutes instead of hours?
                </p>
                <p>
                  Yakdum was born from this vision—to give accounting professionals their time back while empowering 
                  them to provide deeper, more meaningful insights to their clients. We're not replacing accountants; 
                  we're amplifying their expertise.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Save Time</h3>
                </div>
                <p className="text-gray-600">
                  Reduce manual data analysis from hours to minutes. Focus on strategic advice instead of data extraction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Better Insights</h3>
                </div>
                <p className="text-gray-600">
                  AI-powered analysis reveals patterns and trends that might be missed in manual reviews.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Client Focus</h3>
                </div>
                <p className="text-gray-600">
                  Spend more time building relationships and providing strategic guidance to your clients.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Smart Analytics</h3>
                </div>
                <p className="text-gray-600">
                  Turn complex financial data into clear, actionable insights with intelligent charts and reports.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gray-900 text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Ready to transform your practice?</h2>
                <p className="text-gray-300 mb-6">
                  Join accounting professionals who are already saving hours every week with Yakdum.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
