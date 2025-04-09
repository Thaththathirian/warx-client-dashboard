
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FiUsers, FiLogOut, FiGrid, FiShield } from 'react-icons/fi';

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const navItems = [
    { name: 'Dashboard', icon: <FiGrid className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Users', icon: <FiUsers className="h-5 w-5" />, path: '/users' },
    { name: 'Content Protection', icon: <FiShield className="h-5 w-5" />, path: '/protection' },
  ];

  return (
    <Sidebar>
      {/* Header with Logo */}
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <div className="bg-gradient-to-r from-theme-green-600 to-theme-green-400 w-8 h-8 rounded-md flex items-center justify-center mr-2">
              <FiShield className="text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-theme-green-600 to-theme-green-400 bg-clip-text text-transparent">
              WarX
            </span>
          </Link>
          <SidebarTrigger className="lg:hidden" />
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.name}
                  >
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile and Logout */}
      <SidebarFooter className="border-t">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profile} />
              <AvatarFallback className="bg-theme-green-600 text-white">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[160px]">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              logout();
              window.location.href = '/login';
            }} 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <FiLogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <div className="mt-4 text-xs text-center text-muted-foreground">
            &copy; {currentYear} WarX. All rights reserved.
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
