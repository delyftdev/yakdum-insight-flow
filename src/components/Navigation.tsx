
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import PremiumButton from "./PremiumButton";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/auth');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-delyft-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
              About
            </a>
            <a href="#" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/chat')}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <PremiumButton onClick={handleAuthAction}>
                  Get Started
                </PremiumButton>
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
          <div className="md:hidden py-4 border-t border-delyft-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
                Pricing
              </a>
              <a href="#" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
                About
              </a>
              <a href="#" className="text-delyft-gray-700 hover:text-delyft-primary transition-colors">
                Contact
              </a>
              
              <div className="pt-4 border-t border-delyft-gray-200">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/chat')} className="w-full mb-2">
                      Dashboard
                    </Button>
                    <Button variant="outline" onClick={handleSignOut} className="w-full">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/auth')} className="w-full mb-2">
                      Sign In
                    </Button>
                    <PremiumButton onClick={handleAuthAction} className="w-full">
                      Get Started
                    </PremiumButton>
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
