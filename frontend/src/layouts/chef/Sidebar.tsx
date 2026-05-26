"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChefHat,
  BookOpen,
  Package,
  LayoutDashboard,
} from "lucide-react";

const links = [
  /*
  {
    label: "Dashboard",
    href: "/chef/dashboard",
    icon: LayoutDashboard,
  },
  */
  {
    label: "Recetas",
    href: "/chef/recipes",
    icon: BookOpen,
  },
  {
    label: "Ingredientes",
    href: "/chef/ingredients",
    icon: Package,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-24 items-center gap-4 border-b border-gray-200 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
          <ChefHat className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Panel Chef
          </h1>

          <p className="text-xs text-gray-500">
            Gestión de cocina
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}