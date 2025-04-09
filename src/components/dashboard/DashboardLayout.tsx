
import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen } = useSidebar();
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300 ease-in-out",
        isOpen ? "md:ml-64" : "md:ml-16"
      )}>
        {children}
      </main>
    </div>
  );
}
