import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Crear cuenta — MasterCook",
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Form side */}
      <div className="flex w-full flex-col lg:w-1/2">
        <SignUpForm />
      </div>

      {/* Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-brand-950 dark:bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center max-w-sm text-center px-8">
          <div className="text-6xl mb-6">🍽️</div>
          <h2 className="text-3xl font-bold text-white mb-4">Únete hoy</h2>
          <p className="text-brand-300 text-base leading-relaxed">
            Controla el costo real de cada platillo, calcula mermas y genera cotizaciones profesionales para tus eventos.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {[
              "Motor de conversión de unidades",
              "Soporte de sub-recetas jerárquicas",
              "Recalibración dinámica de eventos",
              "Generación de PDF para cotizaciones",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-sm text-brand-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-400 shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
