
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronRight, 
  Settings, 
  User, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  CheckCircle2
} from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  user_type: string;
}

interface Props {
  userProfile: UserProfile | null;
}

const CollapsiblePanel = ({ userProfile }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (!userProfile) return 'U';
    return `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}`.toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      icon: CheckCircle2,
      label: 'Setup Completion',
      onClick: () => navigate('/setup-completion')
    },
    {
      icon: User,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      icon: CreditCard,
      label: 'Upgrade',
      onClick: () => navigate('/upgrade')
    },
    {
      icon: HelpCircle,
      label: 'Help',
      onClick: () => navigate('/help')
    },
    {
      icon: LogOut,
      label: 'Log Out',
      onClick: handleSignOut
    }
  ];

  return (
    <div className="fixed left-4 top-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-delyft-gray-200 hover:bg-white/90 transition-all"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-delyft-primary text-white text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {userProfile && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-delyft-gray-900">
                  {userProfile.first_name} {userProfile.last_name}
                </span>
                <span className="text-xs text-delyft-gray-600">
                  {userProfile.user_type === 'accounting_firm' ? 'Firm' : 'Business'}
                </span>
              </div>
            )}
            <ChevronRight 
              className={`w-4 h-4 text-delyft-gray-500 transition-transform ${
                isOpen ? 'rotate-90' : ''
              }`} 
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <div className="bg-white/95 backdrop-blur-sm border border-delyft-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto hover:bg-delyft-gray-100"
                onClick={item.onClick}
              >
                <item.icon className="w-4 h-4 mr-3 text-delyft-gray-600" />
                <span className="text-sm text-delyft-gray-900">{item.label}</span>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsiblePanel;
