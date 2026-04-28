"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  ChefHat,
  Package,
  CalendarDays,
  Users,
  ClipboardList,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const mainNavItems: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, name: "Dashboard", path: "/dashboard" },
  {
    icon: <ChefHat size={18} />,
    name: "Recetas",
    subItems: [
      { name: "Todas las recetas", path: "/recipes" },
      { name: "Nueva receta", path: "/recipes/new" },
    ],
  },
  {
    icon: <Package size={18} />,
    name: "Ingredientes",
    subItems: [
      { name: "Inventario", path: "/ingredients" },
      { name: "Categorías", path: "/categories" },
    ],
  },
  {
    icon: <CalendarDays size={18} />,
    name: "Eventos",
    subItems: [
      { name: "Todos los eventos", path: "/events" },
      { name: "Nueva cotización", path: "/events/new" },
    ],
  },
];

const adminNavItems: NavItem[] = [
  { icon: <Users size={18} />, name: "Usuarios", path: "/admin/users" },
  { icon: <ClipboardList size={18} />, name: "Auditoría", path: "/admin/audit" },
];

const NavList = ({
  items,
  isCollapsed,
  openSubmenu,
  subMenuRefs,
  subMenuHeight,
  isActive,
  isGroupActive,
  toggleSubmenu,
}: {
  items: NavItem[];
  isCollapsed: boolean;
  openSubmenu: string | null;
  subMenuRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  subMenuHeight: Record<string, number>;
  isActive: (p: string) => boolean;
  isGroupActive: (item: NavItem) => boolean;
  toggleSubmenu: (key: string) => void;
}) => (
  <ul className="flex flex-col gap-0.5">
    {items.map((item) => {
      const key = item.name;
      return (
        <li key={key}>
          {item.subItems ? (
            <>
              <button
                onClick={() => toggleSubmenu(key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isGroupActive(item)
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="flex-1 text-left">{item.name}</span>}
                {!isCollapsed && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${openSubmenu === key ? "rotate-180" : ""}`}
                  />
                )}
              </button>
              {!isCollapsed && (
                <div
                  ref={(el) => { subMenuRefs.current[key] = el; }}
                  className="overflow-hidden transition-all duration-200"
                  style={{ height: openSubmenu === key ? `${subMenuHeight[key] ?? 0}px` : "0px" }}
                >
                  <ul className="mt-0.5 ml-7 flex flex-col gap-0.5 pb-1 border-l border-gray-200 dark:border-gray-800 pl-3">
                    {item.subItems.map((sub) => (
                      <li key={sub.path}>
                        <Link
                          href={sub.path}
                          className={`block px-2 py-1.5 rounded-md text-sm transition-colors
                            ${isActive(sub.path)
                              ? "text-brand-600 dark:text-brand-400 font-medium"
                              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive(item.path)
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }
                ${isCollapsed ? "justify-center" : ""}`}
            >
              {isActive(item.path!) ? (
                <span className="shrink-0 text-brand-500">{item.icon}</span>
              ) : (
                <span className="shrink-0">{item.icon}</span>
              )}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ) : null}
        </li>
      );
    })}
  </ul>
);

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => pathname === path, [pathname]);
  const isGroupActive = useCallback(
    (item: NavItem) => item.subItems?.some((s) => isActive(s.path)) ?? false,
    [isActive]
  );

  useEffect(() => {
    const allItems = [...mainNavItems, ...adminNavItems];
    const found = allItems.find((n) => isGroupActive(n));
    setOpenSubmenu(found ? found.name : null);
  }, [pathname, isGroupActive]);

  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight((prev) => ({
        ...prev,
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight ?? 0,
      }));
    }
  }, [openSubmenu]);

  const toggleSubmenu = (key: string) =>
    setOpenSubmenu((prev) => (prev === key ? null : key));

  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  const navProps = { isCollapsed, openSubmenu, subMenuRefs, subMenuHeight, isActive, isGroupActive, toggleSubmenu };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-3 left-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen ? "w-[240px]" : isHovered ? "w-[240px]" : "w-[64px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-5 flex ${isCollapsed ? "justify-center" : "justify-start"}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
            <ChefHat size={14} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[15px] text-gray-900 dark:text-white tracking-tight">
              MasterCook
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pb-6 no-scrollbar">
        {!isCollapsed && (
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Principal
          </p>
        )}
        {isCollapsed && (
          <div className="flex justify-center mb-2">
            <MoreHorizontal size={16} className="text-gray-400" />
          </div>
        )}

        <NavList items={mainNavItems} {...navProps} />

        <div className={`my-5 border-t border-gray-200 dark:border-gray-800 ${isCollapsed ? "mx-2" : ""}`} />

        {!isCollapsed && (
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Admin
          </p>
        )}

        <NavList items={adminNavItems} {...navProps} />
      </nav>
    </aside>
  );
};

export default AppSidebar;
