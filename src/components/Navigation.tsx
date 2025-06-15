
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    // Direct to auth page with signup mode
    navigate('/auth?mode=signup');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-black transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-black transition-colors">
              Pricing
            </a>
            <button 
              onClick={() => navigate('/about')} 
              className="text-gray-700 hover:text-black transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="text-gray-700 hover:text-black transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/chat')} className="text-black hover:bg-gray-100">
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut} className="border-gray-200 text-black hover:bg-gray-50">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="text-black hover:bg-gray-100">
                  Sign In
                </Button>
                <Button onClick={handleGetStarted} className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-black transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-black transition-colors">
                Pricing
              </a>
              <button 
                onClick={() => navigate('/about')} 
                className="text-gray-700 hover:text-black transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => navigate('/contact')} 
                className="text-gray-700 hover:text-black transition-colors text-left"
              >
                Contact
              </button>
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/chat')} className="w-full mb-2 text-black hover:bg-gray-100">
                      Dashboard
                    </Button>
                    <Button variant="outline" onClick={handleSignOut} className="w-full border-gray-200 text-black hover:bg-gray-50">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/auth')} className="w-full mb-2 text-black hover:bg-gray-100">
                      Sign In
                    </Button>
                    <Button onClick={handleGetStarted} className="w-full bg-black text-white hover:bg-gray-800">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
