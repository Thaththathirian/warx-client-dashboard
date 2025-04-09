
import { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Settings, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuthStore();
  const { isOpen, toggleSidebar } = useSidebar();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const getInitials = (name: string = 'User') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-sm transition-all duration-200",
        scrolled ? "bg-white/90 dark:bg-gray-900/90 border-b shadow-sm" : "bg-transparent"
      )}
    >
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 md:hidden" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-medium text-primary">Anti-Piracy</span>
          </div>
        </div>

        <div className={cn(
          "flex-1 flex justify-center mx-4 transition-all duration-200",
          isOpen ? "md:ml-0" : "md:ml-8"
        )}>
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..."
              className="pl-10 w-full bg-background/80 border-muted focus-visible:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.profile} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
