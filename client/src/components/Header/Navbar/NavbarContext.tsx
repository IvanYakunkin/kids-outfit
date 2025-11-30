"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface NavbarContextType {
  isOpen: boolean;
  toggleNavbar: () => void;
  closeNavbar: () => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
    }
  }, [isOpen]);

  const toggleNavbar = () => setIsOpen(true);
  const closeNavbar = () => setIsOpen(false);

  return (
    <NavbarContext.Provider value={{ isOpen, toggleNavbar, closeNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext() {
  const context = useContext(NavbarContext);
  if (!context)
    throw new Error("useNavbarContext must be used within NavbarProvider");
  return context;
}
