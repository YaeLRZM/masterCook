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
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await signIn({
        email,
        password,
      });

      setAuth(response.user, response.token);

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
          <div className="mb-6">
            <img
              src="/logo.png"
              alt="MasterCook Logo"
              className="mx-auto mb-4 block h-52 w-auto"
            />

            <h1 className="text-4xl font-bold tracking-tight">
              Iniciar sesión
            </h1>

            <p className="mt-2 text-gray-500">
              Ingresa tus credenciales
              para acceder a MasterCook.
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

            <p className="mt-2 text-sm text-gray-500">
              Términos y condiciones
              aplican. Al iniciar sesión,
              aceptas nuestra{" "}
              <a
                href="/terms"
                className="text-blue-600 hover:underline"
              >
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div
        className="relative hidden overflow-hidden p-12 text-white lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold leading-tight">
            Control total de tu
            cocina
          </h2>

          <p className="mt-6 text-lg text-white/80">
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
              "Personal",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm backdrop-blur"
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