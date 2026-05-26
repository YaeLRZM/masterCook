"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-6 hidden md:flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
          <ChefHat className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">MasterCook</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link
          href="/auxiliar/recipes"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
        >
          <ChefHat className="h-5 w-5" />
          <span className="font-medium">Recetas</span>
        </Link>
      </nav>

      {/* Footer text */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 MasterCook
        </p>
      </div>
    </aside>
  );
}