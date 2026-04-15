"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

// ── Icons (inline SVG — no external dependency) ───────────────────────────────

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const ChefHatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
    <line x1="6" y1="17" x2="18" y2="17"/>
  </svg>
);
const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
);

// ── Nav definition ────────────────────────────────────────────────────────────

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  {
    icon: <ChefHatIcon />,
    name: "Recetas",
    subItems: [
      { name: "Todas las recetas", path: "/recipes" },
      { name: "Nueva receta", path: "/recipes/new" },
    ],
  },
  {
    icon: <PackageIcon />,
    name: "Ingredientes",
    subItems: [
      { name: "Inventario", path: "/ingredients" },
      { name: "Categorías", path: "/categories" },
    ],
  },
  {
    icon: <CalendarIcon />,
    name: "Eventos",
    subItems: [
      { name: "Todos los eventos", path: "/events" },
      { name: "Nueva cotización", path: "/events/new" },
    ],
  },
  { icon: <TagIcon />, name: "Categorías", path: "/categories" },
];

// ── Component ─────────────────────────────────────────────────────────────────

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => pathname === path, [pathname]);
  const isGroupActive = useCallback(
    (item: NavItem) => item.subItems?.some((s) => isActive(s.path)) ?? false,
    [isActive]
  );

  // Auto-open submenu for the current route
  useEffect(() => {
    const idx = navItems.findIndex((n) => isGroupActive(n));
    setOpenSubmenu(idx >= 0 ? idx : null);
  }, [pathname, isGroupActive]);

  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight((prev) => ({
        ...prev,
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight ?? 0,
      }));
    }
  }, [openSubmenu]);

  const toggleSubmenu = (index: number) =>
    setOpenSubmenu((prev) => (prev === index ? null : index));

  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen ? "w-[260px]" : isHovered ? "w-[260px]" : "w-[80px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-6 flex ${isCollapsed ? "justify-center" : "justify-start"}`}>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">👨‍🍳</span>
          {!isCollapsed && (
            <span className="font-bold text-lg text-gray-900 dark:text-white">MasterCook</span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pb-6">
        <p className={`mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${isCollapsed ? "text-center" : ""}`}>
          {isCollapsed ? <DotsIcon /> : "Menú"}
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <li key={item.name}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isGroupActive(item) || openSubmenu === index
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      }
                      ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="flex-1 text-left">{item.name}</span>}
                    {!isCollapsed && (
                      <ChevronDownIcon
                        className={`transition-transform duration-200 ${openSubmenu === index ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                  {!isCollapsed && (
                    <div
                      ref={(el) => { subMenuRefs.current[index] = el; }}
                      className="overflow-hidden transition-all duration-300"
                      style={{ height: openSubmenu === index ? `${subMenuHeight[index] ?? 0}px` : "0px" }}
                    >
                      <ul className="mt-1 ml-8 flex flex-col gap-1 pb-1">
                        {item.subItems.map((sub) => (
                          <li key={sub.path}>
                            <Link
                              href={sub.path}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors
                                ${isActive(sub.path)
                                  ? "bg-brand-500 text-white"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : item.path ? (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? "bg-brand-500 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    }
                    ${isCollapsed ? "justify-center" : ""}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebar;
