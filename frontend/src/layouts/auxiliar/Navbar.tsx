"use client";

import {
  LogOut,
} from "lucide-react";

import { logout } from "@/lib/auth";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Navbar() {
  const { user } = useAuthStore();

  const getInitial = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  const getBgColor = () => {
    switch (user?.role) {
      case "CHEF":
        return "bg-orange-100 text-orange-600";
      case "AYUDANTE_CHEF":
        return "bg-blue-100 text-blue-600";
      case "VENDEDOR":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Instrucciones de Recetas
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* LOGOUT */}

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>

        {/* USER */}

        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${getBgColor()}`}>
            {getInitial(user?.name || "")}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "Usuario"}
            </p>

            <p className="text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}