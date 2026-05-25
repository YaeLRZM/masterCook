"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Users,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Empresas",
    href: "/super-admin/companies",
    icon: Building2,
  },

  {
    label: "Usuarios",
    href: "/super-admin/users",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-[270px] flex-col border-r border-gray-200 bg-white">
      {/* LOGO */}

      <div className="border-b border-gray-100 px-6 py-8">
        <img src="/logoSide.png" alt="MasterCook Logo" className="h-40 w-auto mb-6 mx-auto block" />

        <p className="mt-4 text-center text-xl font-semibold text-gray-700">
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
    </aside>
  );
}