"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },

  {
    label: "Audit",
    href: "/admin/audit",
    icon: ShieldCheck,
  },

  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* LOGO */}

      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            MasterCook
          </h1>

          <p className="text-xs text-gray-500">
            Company Panel
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
                  ? "bg-orange-500 text-white shadow-sm"
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