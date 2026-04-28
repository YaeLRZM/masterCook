"use client";

import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";

const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { isExpanded, isHovered } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:ml-[240px]" : "lg:ml-[64px]"}`}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 mx-auto w-full max-w-screen-2xl">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <LayoutContent>{children}</LayoutContent>
  </SidebarProvider>
);

export default AppLayout;
