"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/InputField";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M18.75 10.19C18.75 9.47 18.69 8.95 18.56 8.41H10.18V11.65H15.1C15 12.46 14.47 13.68 13.27 14.49L15.91 16.63C17.78 15.1 18.75 12.86 18.75 10.19Z" fill="#4285F4"/>
    <path d="M10.18 18.75C12.59 18.75 14.61 17.97 16.09 16.63L13.27 14.49C12.52 15.01 11.51 15.37 10.18 15.37C7.82 15.37 5.81 13.84 5.1 11.73L2.2 13.93C3.67 16.79 6.69 18.75 10.18 18.75Z" fill="#34A853"/>
    <path d="M5.1 11.73C4.91 11.19 4.8 10.6 4.8 10C4.8 9.4 4.91 8.81 5.09 8.27L2.2 6.07C1.6 7.26 1.25 8.59 1.25 10C1.25 11.41 1.6 12.74 2.2 13.93L5.1 11.73Z" fill="#FBBC05"/>
    <path d="M10.18 4.63C11.86 4.63 12.99 5.34 13.63 5.94L16.15 3.52C14.6 2.12 12.59 1.25 10.18 1.25C6.69 1.25 3.67 3.21 2.2 6.07L5.09 8.27C5.81 6.16 7.82 4.63 10.18 4.63Z" fill="#EB4335"/>
  </svg>
);

export default function SignInForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Bienvenido de nuevo a MasterCook
          </p>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button type="button" onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 transition-colors">
            <GoogleIcon /> Google
          </button>
          <button type="button" onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 transition-colors">
            <svg width="18" height="18" viewBox="0 0 21 20" className="fill-current"><path d="M15.67 1.875H18.43L12.4 8.76L19.49 18.125H13.94L9.6 12.44L4.63 18.125H1.87L8.31 10.76L1.51 1.875H7.2L11.13 7.07L15.67 1.875ZM14.7 16.475H16.23L6.37 3.44H4.73L14.7 16.475Z"/></svg>
            Twitter / X
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-gray-900 px-4 text-xs text-gray-400">O continúa con email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <InputField id="email" type="email" placeholder="tu@email.com" autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <InputField id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>

          <Button type="submit" className="w-full" size="md">
            Entrar al dashboard
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
