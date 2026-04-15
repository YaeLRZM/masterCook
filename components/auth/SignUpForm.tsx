"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/InputField";

export default function SignUpForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Únete a MasterCook y empieza a gestionar tu cocina
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <InputField id="firstName" type="text" placeholder="Carlos" />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <InputField id="lastName" type="text" placeholder="García" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <InputField id="email" type="email" placeholder="tu@email.com" autoComplete="email" />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <InputField id="password" type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
          </div>

          <Button type="submit" className="w-full" size="md">
            Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/signin" className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
