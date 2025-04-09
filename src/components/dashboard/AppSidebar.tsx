import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FiUsers, FiLogOut, FiGrid, FiShield, FiChevronLeft, FiChevronRight, FiFileText } from 'react-icons/fi';

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const { isOpen, toggleSidebar, isMobile } = useSidebar();
  const currentYear = new Date().getFullYear();

  const navItems = [
    { name: 'Dashboard', icon: <FiGrid className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Users', icon: <FiUsers className="h-5 w-5" />, path: '/users' },
    { name: 'Reports', icon: <FiFileText className="h-5 w-5" />, path: '/reports' },
    { name: 'Content Protection', icon: <FiShield className="h-5 w-5" />, path: '/protection' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Mobile sidebar overlay
  if (isMobile && !isOpen) {
    return (
      <Button 
        onClick={toggleSidebar} 
        variant="ghost" 
        size="icon" 
        className="fixed left-4 top-4 z-50 md:hidden"
      >
        <FiChevronRight className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-sm",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "hidden"
        )}
      >
        {/* Logo and toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <div className="bg-gradient-to-r from-theme-green-600 to-theme-green-400 w-8 h-8 rounded-md flex items-center justify-center">
              <FiShield className="text-white" />
            </div>
            {isOpen && (
              <span className="ml-2 font-bold text-xl bg-gradient-to-r from-theme-green-600 to-theme-green-400 bg-clip-text text-transparent">
                WarX
              </span>
            )}
          </Link>
          <Button 
            onClick={toggleSidebar} 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", isMobile && "md:hidden")}
          >
            {isOpen ? <FiChevronLeft className="h-5 w-5" /> : <FiChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-theme-green-50 text-theme-green-700 dark:bg-theme-green-900/20 dark:text-theme-green-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  )}
                >
                  <span className="mr-3 flex-shrink-0">{item.icon}</span>
                  {isOpen && <span className="truncate">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile and logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {isOpen ? (
            <>
              <div className="flex items-center mb-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profile} />
                  <AvatarFallback className="bg-theme-green-600 text-white">
                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <FiLogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                &copy; {currentYear} WarX. All rights reserved.
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.profile} />
                <AvatarFallback className="bg-theme-green-600 text-white">
                  {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <FiLogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
