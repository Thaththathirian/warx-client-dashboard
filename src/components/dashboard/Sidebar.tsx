
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FiHome, FiPieChart, FiTrendingUp, FiSettings, FiSearch, FiFile, FiShield, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <FiHome className="w-5 h-5" />,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: <FiPieChart className="w-5 h-5" />,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: <FiTrendingUp className="w-5 h-5" />,
  },
  {
    title: 'Monitoring',
    href: '/dashboard/monitoring',
    icon: <FiActivity className="w-5 h-5" />,
  },
  {
    title: 'Threats',
    href: '/dashboard/threats',
    icon: <FiAlertTriangle className="w-5 h-5" />,
  },
  {
    title: 'Protection',
    href: '/dashboard/protection',
    icon: <FiShield className="w-5 h-5" />,
  },
  {
    title: 'Documents',
    href: '/dashboard/documents',
    icon: <FiFile className="w-5 h-5" />,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <FiSettings className="w-5 h-5" />,
  },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const isMobile = useIsMobile();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: isMobile ? '-100%' : 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black"
        />
      )}

      <AnimatePresence>
        <motion.aside
          initial={isMobile ? 'closed' : 'open'}
          animate={isOpen ? 'open' : 'closed'}
          variants={sidebarVariants}
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar dark:bg-sidebar border-r border-gray-200 dark:border-gray-800',
            isMobile && !isOpen && 'hidden'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 w-full">
                <div className="bg-theme-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <FiShield className="text-white" />
                </div>
                <h2 className="font-bold text-lg">Anti-Piracy</h2>
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar} 
                    className="ml-auto"
                  >
                    <FiSearch className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="px-2 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-theme-green-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                        )
                      }
                      onClick={isMobile ? toggleSidebar : undefined}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-theme-green-100 dark:bg-theme-green-900 flex items-center justify-center">
                    <FiShield className="h-5 w-5 text-theme-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Protection Active</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">All systems operational</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
