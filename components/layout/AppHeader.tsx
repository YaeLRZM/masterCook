"use client";

import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon, LogOut, ChefHat } from "lucide-react";

const AppHeader: React.FC = () => {
  const [signingOut, setSigningOut] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = () => {
    setSigningOut(true);
    document.cookie = "mc_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/signin";
  };

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-2.5 lg:px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
            <ChefHat size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">MasterCook</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-semibold">
          YR
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title="Cerrar sesión"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
