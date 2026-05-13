"use client";

import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Navbar() {
  const router = useRouter();

  const { user, logout } =
    useAuthStore();

  const handleLogout = () => {
    logout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/signin");
  };

  return (
    <header className="flex h-[80px] items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* LEFT */}

      <div>
        <h1 className="text-xl font-semibold">
          Welcome back 👋
        </h1>

        <p className="text-sm text-gray-500">
          Manage your platform efficiently
        </p>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">
        {/* SEARCH */}

        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 lg:flex">
          <Search
            size={16}
            className="text-gray-400"
          />

          <input
            placeholder="Search..."
            className="bg-transparent text-sm outline-none"
          />
        </div>

        {/* NOTIFICATIONS */}

        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50">
          <Bell size={18} />
        </button>

        {/* USER */}

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {user?.name?.charAt(0)}
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-medium">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500">
              {user?.role}
            </p>
          </div>
        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}