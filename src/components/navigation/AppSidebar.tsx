
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSidebarProps {
  userProfile: any;
}

const AppSidebar = ({ userProfile }: AppSidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate('/auth');
    }
  };

  const mainNavItems = [
    { icon: Home, label: 'Dashboard', path: '/chat' },
    ...(userProfile?.user_type === 'accounting_firm' 
      ? [{ icon: Users, label: 'Clients', path: '/clients' }] 
      : []
    ),
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: CreditCard, label: 'Upgrade', path: '/upgrade' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  const initials = userProfile?.first_name && userProfile?.last_name
    ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-delyft-primary text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userProfile?.first_name && userProfile?.last_name
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userProfile?.user_type === 'accounting_firm' ? 'Accounting Firm' : 'Individual Business'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                onClick={() => navigate(item.path)}
                isActive={window.location.pathname === item.path}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton onClick={() => navigate(item.path)}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator className="my-2" />
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
