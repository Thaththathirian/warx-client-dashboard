
import { useSidebar as useUISidebar } from "@/components/ui/sidebar";
import { useIsMobile } from './use-mobile';
import { useEffect } from 'react';

export function useSidebar() {
  const { 
    open: isOpen, 
    setOpen: setIsOpen, 
    openMobile, 
    setOpenMobile,
    toggleSidebar,
    isMobile
  } = useUISidebar();

  // Auto-collapse on mobile when component mounts
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      setOpenMobile(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile, setIsOpen, setOpenMobile]);

  return {
    isOpen,
    openMobile,
    toggleSidebar,
    isMobile
  };
}
