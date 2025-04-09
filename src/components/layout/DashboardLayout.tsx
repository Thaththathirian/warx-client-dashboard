
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isLoading } = useProtectedRoute();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex flex-col flex-1 ${isMobile ? '' : (isSidebarOpen ? 'lg:ml-64' : '')}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex lg:w-64 flex-shrink-0 h-screen">
        <div className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo area */}
          <div className="h-16 border-b border-gray-200 dark:border-gray-700 p-4">
            <Skeleton className="h-8 w-3/4" />
          </div>
          {/* Nav items */}
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Navbar skeleton */}
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <Skeleton className="h-10 w-10" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-4 lg:p-8">
          <Skeleton className="h-8 w-1/4 mb-6" />
          <Skeleton className="h-6 w-2/4 mb-8" />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
