
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export function useSidebar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile); // Open by default on desktop

  useEffect(() => {
    // When screen size changes, adjust sidebar state
    setIsOpen(!isMobile); // Auto-open on desktop, closed on mobile
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return { isOpen, toggleSidebar, isMobile };
}
