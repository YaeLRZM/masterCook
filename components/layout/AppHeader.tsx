"use client";

import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="11" y2="15"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/>
  </svg>
);
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const AppHeader: React.FC = () => {
  const [signingOut, setSigningOut] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = () => {
    setSigningOut(true);
    // Delete session cookie
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
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 lg:px-6">
      {/* Left: toggle + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <span className="font-semibold text-gray-800 dark:text-white lg:hidden">MasterCook</span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-bold">
          MC
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title="Cerrar sesión"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
