
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiLogOut, FiMenu, FiX, FiGrid, FiShield } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: isMobile ? "-100%" : 0,
      width: isMobile ? 0 : "auto",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <FiGrid className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Users', icon: <FiUsers className="h-5 w-5" />, path: '/users' },
    { name: 'Content Protection', icon: <FiShield className="h-5 w-5" />, path: '/protection' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          variants={sidebarVariants}
          initial={false}
          animate={isOpen || !isMobile ? "open" : "closed"}
          className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col ${isMobile ? '' : 'lg:static'}`}
        >
          {/* Logo and close button - fixed at top */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center">
              <div className="bg-gradient-to-r from-theme-green-600 to-theme-green-400 w-8 h-8 rounded-md flex items-center justify-center mr-2">
                <FiShield className="text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-theme-green-600 to-theme-green-400 bg-clip-text text-transparent">
                WarX
              </span>
            </Link>
            {isMobile && (
              <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation - scrollable content */}
          <ScrollArea className="flex-1 py-2">
            <nav className="px-3">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === item.path
                          ? 'bg-theme-green-50 text-theme-green-700 dark:bg-theme-green-900/20 dark:text-theme-green-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>

          {/* User profile and logout - fixed at bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
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
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
