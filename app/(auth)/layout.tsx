import { ThemeProvider } from "@/context/ThemeContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-white dark:bg-gray-900">
        {children}
      </div>
    </ThemeProvider>
  );
}
