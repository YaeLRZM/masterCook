"use client";

import {
  LogOut,
} from "lucide-react";

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
        {/* LOGOUT */}

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />

          Cerrar Sesión
        </button>

        {/* USER */}

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
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