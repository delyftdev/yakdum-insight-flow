
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  HelpCircle, 
  Crown, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Wrench
} from 'lucide-react';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  user_type?: string;
  email?: string;
}

interface CollapsiblePanelProps {
  userProfile: UserProfile | null;
}

const CollapsiblePanel = ({ userProfile }: CollapsiblePanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: MessageSquare,
      label: 'Chat',
      path: '/chat',
      description: 'AI Financial Assistant'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      description: 'Manage your account'
    },
    {
      icon: Wrench,
      label: 'Setup',
      path: '/setup-completion',
      description: 'Complete your setup'
    },
    {
      icon: HelpCircle,
      label: 'Help',
      path: '/help',
      description: 'Get support'
    },
    {
      icon: Crown,
      label: 'Upgrade',
      path: '/upgrade',
      description: 'Premium features'
    }
  ];

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 w-16 flex flex-col">
        <div className="p-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col space-y-2 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className="w-12 h-12 p-0"
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
        
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-12 h-12 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 w-80">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          
          {userProfile && (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userProfile.first_name && userProfile.last_name 
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : userProfile.email?.split('@')[0] || 'User'
                      }
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500 truncate">
                        {userProfile.company_name || userProfile.email}
                      </p>
                      {userProfile.user_type === 'accounting_firm' && (
                        <Badge variant="secondary" className="text-xs">
                          Firm
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className="w-full justify-start h-auto p-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollapsiblePanel;
