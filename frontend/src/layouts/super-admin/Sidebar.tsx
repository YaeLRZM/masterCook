"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Companies",
    href: "/super-admin/companies",
    icon: Building2,
  },

  {
    label: "Users",
    href: "/super-admin/users",
    icon: Users,
  },

  {
    label: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-[270px] flex-col border-r border-gray-200 bg-white">
      {/* LOGO */}

      <div className="border-b border-gray-100 p-6">
        <h1 className="text-2xl font-bold tracking-tight">
          MasterCook
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Super Admin Panel
        </p>
      </div>

      {/* NAVIGATION */}

      <nav className="flex flex-1 flex-col gap-2 p-4">
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
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />

              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}

      <div className="border-t border-gray-100 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white">
          <p className="text-sm font-semibold">
            MasterCook
          </p>

          <p className="mt-1 text-xs text-blue-100">
            Intelligent kitchen
            management system.
          </p>
        </div>
      </div>
    </aside>
  );
}