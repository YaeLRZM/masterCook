"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

import { Role } from "@/types/role.types";

export default function SignInPage() {
  const router = useRouter();

  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await signIn({
        email,
        password,
      });

      setAuth(
        response.user,
        response.token
      );

      localStorage.setItem(
        "token",
        response.token
      );
      document.cookie = `token=${response.token}; path=/`;

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      switch (response.user.role) {
        case Role.SUPER_ADMIN:
          router.push(
            "/super-admin/dashboard"
          );
          break;

        case Role.ADMIN:
          router.push(
            "/admin/dashboard"
          );
          break;

        case Role.CHEF:
          router.push("/chef/recipes");
          break;

        case Role.AUXILIAR:
          router.push(
            "/auxiliar/recipes"
          );
          break;

        case Role.SALES:
          router.push("/sales/events");
          break;

        default:
          router.push("/unauthorized");
      }
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE */}

      <div className="flex w-full items-center justify-center bg-white lg:w-1/2">
        <div className="w-full max-w-md p-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              MasterCook
            </h1>

            <p className="mt-2 text-gray-500">
              Sistema profesional de gestión
              gastronómica
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500"
                placeholder="admin@test.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
            >
              {loading
                ? "Loading..."
                : "Sign In"}
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Demo:
            </p>

            <p className="mt-2 text-sm">
              admin@test.com
            </p>

            <p className="text-sm">
              123456
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white">
        <div className="max-w-md">
          <div className="mb-6 text-6xl">
            👨‍🍳
          </div>

          <h2 className="text-5xl font-bold leading-tight">
            Control total de tu cocina
          </h2>

          <p className="mt-6 text-lg text-blue-100">
            Administra recetas,
            ingredientes, eventos,
            costos y personal desde un
            solo lugar.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Recetas",
              "Eventos",
              "Costos",
              "Auditoría",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}