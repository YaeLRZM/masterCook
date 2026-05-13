"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  ChefHat,
  BookOpen,
  Package,
  DollarSign,
} from "lucide-react";

const links = [
  {
    label: "Recipes",
    href: "/chef/recipes",
    icon: BookOpen,
  },

  {
    label: "Ingredients",
    href: "/chef/ingredients",
    icon: Package,
  },

 
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* LOGO */}

      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100">
          <ChefHat className="h-5 w-5 text-orange-600" />
        </div>

        <div>
          <h1 className="text-lg font-bold">
            Chef Panel
          </h1>

          <p className="text-xs text-gray-500">
            Kitchen management
          </p>
        </div>
      </div>

      {/* NAV */}

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const active =
            pathname === link.href;

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
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