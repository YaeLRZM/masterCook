import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MasterCook — Gestión de recetas y cotización de eventos",
  description: "Sistema profesional de costeo de recetas, control de mermas y cotización de eventos gastronómicos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="h-full min-h-screen">{children}</body>
    </html>
  );
}
