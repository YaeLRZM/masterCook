"use client";

import { LogOut, Bell } from "lucide-react";
import { logout } from "@/lib/auth";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Operaciones de Cocina
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-2xl border border-gray-200 p-2 hover:bg-gray-50">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            C
          </div>

          <div>
            <p className="text-sm font-semibold">
              Chef
            </p>

            <p className="text-xs text-gray-500">
              chef@test.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}