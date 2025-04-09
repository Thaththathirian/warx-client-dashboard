
import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
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
      <div className={cn(
        "flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "md:ml-64" : "md:ml-16"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
