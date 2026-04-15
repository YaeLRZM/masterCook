import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — MasterCook",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Form side */}
      <div className="flex w-full flex-col lg:w-1/2">
        <SignInForm />
      </div>

      {/* Decorative panel — visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-brand-950 dark:bg-white/5 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center max-w-sm text-center px-8">
          <div className="text-6xl mb-6">👨‍🍳</div>
          <h2 className="text-3xl font-bold text-white mb-4">MasterCook</h2>
          <p className="text-brand-300 text-base leading-relaxed">
            Sistema profesional de costeo de recetas, control de mermas y cotización de eventos gastronómicos.
          </p>
          <div className="mt-8 flex gap-4">
            {["Recetas", "Eventos", "Costos", "PDF"].map((tag) => (
              <span key={tag} className="rounded-full border border-brand-700 px-3 py-1 text-xs text-brand-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
