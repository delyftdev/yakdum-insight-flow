import { 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navigation from "../components/Navigation";
import Logo from "../components/Logo";
import PremiumCard from "../components/PremiumCard";
import PremiumButton from "../components/PremiumButton";
import FeatureCard from "../components/FeatureCard";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Natural Language Queries",
      description: "Ask questions about your finances in plain English and get instant, accurate answers.",
      gradient: "from-black to-gray-800"
    },
    {
      icon: BarChart3,
      title: "Real-time Insights",
      description: "Connect QuickBooks or Xero for live data analysis with sophisticated visualizations.",
      gradient: "from-gray-800 to-gray-600"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analytics",
      description: "Advanced AI processes your data to uncover trends, patterns, and actionable insights.",
      gradient: "from-gray-700 to-gray-500"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security.",
      gradient: "from-black to-gray-700"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share insights, reports, and collaborate with your team and accountants seamlessly.",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Get answers in seconds, not hours. Our AI processes complex queries lightning fast.",
      gradient: "from-gray-800 to-black"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CFO, TechCorp",
      content: "Yakdum has transformed how we analyze our financials. What used to take hours now takes minutes.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Rodriguez",
      role: "Accounting Partner",
      content: "Our clients love the instant insights. It's revolutionized our advisory services.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Johnson",
      role: "Small Business Owner",
      content: "Finally, accounting insights I can actually understand and act on immediately.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small businesses getting started",
      features: [
        "1 accounting connection",
        "50 queries per month",
        "Basic insights & reports",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      description: "Ideal for growing businesses and teams",
      features: [
        "5 accounting connections",
        "500 queries per month",
        "Advanced AI insights",
        "Team collaboration",
        "Priority support",
        "Custom reports"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$149",
      description: "For large organizations and accounting firms",
      features: [
        "Unlimited connections",
        "Unlimited queries",
        "White-label solution",
        "Advanced integrations",
        "Dedicated success manager",
        "Custom AI training"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-black/10 text-black font-medium text-sm mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Accounting Insights
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
              <span className="text-black">AI-powered</span><br />
              accounting insights<br />
              <span className="text-gray-900">that work for you</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect QuickBooks Online or Xero and ask natural language questions to receive 
              real-time AI-backed insights with sophisticated processing visualization.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <PremiumButton size="lg" className="group" onClick={handleGetStarted}>
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </PremiumButton>
              <PremiumButton variant="outline" size="lg">
                Watch Demo
              </PremiumButton>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                2-minute setup
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Bank-level security
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              Powerful features for modern accounting
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to transform your financial data into actionable business insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              Trusted by finance professionals
            </h2>
            <div className="flex items-center justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
              <span className="ml-3 text-gray-600 font-medium">4.9/5 from 2,000+ users</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <PremiumCard key={index} className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <PremiumCard 
                key={index} 
                className={`p-8 relative ${tier.popular ? 'ring-2 ring-black' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-black to-gray-800 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-display text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    {tier.price !== "Free" && <span className="text-gray-600">/month</span>}
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <PremiumButton 
                  variant={tier.popular ? "primary" : "outline"} 
                  className="w-full"
                  onClick={handleGetStarted}
                >
                  {tier.price === "Free" ? "Get Started" : "Start Free Trial"}
                </PremiumButton>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-black to-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold font-display text-white mb-6">
            Ready to transform your accounting insights?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses already using Yakdum to make smarter financial decisions.
          </p>
          <PremiumButton 
            variant="secondary" 
            size="lg" 
            className="bg-white text-black hover:bg-gray-50"
            onClick={handleGetStarted}
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </PremiumButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo />
              <p className="text-gray-600 mt-4 max-w-md">
                AI-powered accounting insights that work for you. Connect, ask, and discover 
                financial insights in seconds.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <button 
                onClick={() => navigate('/privacy')} 
                className="text-gray-600 hover:text-black transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms')} 
                className="text-gray-600 hover:text-black transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => navigate('/support')} 
                className="text-gray-600 hover:text-black transition-colors"
              >
                Support
              </button>
              <button 
                onClick={() => navigate('/contact')} 
                className="text-gray-600 hover:text-black transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Yakdum. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
