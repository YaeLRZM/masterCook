"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Utensils } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const active =
    pathname === "/auxiliar/recipes" ||
    pathname.startsWith("/auxiliar/recipes/");

  return (
    <aside className="hidden w-72 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-24 items-center gap-4 border-b border-gray-200 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
          <Utensils className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Panel Auxiliar
          </h1>

          <p className="text-xs text-gray-500">
            Instrucciones de cocina
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <Link
          href="/auxiliar/recipes"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
            active
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          Recetas
        </Link>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-center text-xs text-gray-400">
          MasterCook © 2026
        </p>
      </div>
    </aside>
  );
}