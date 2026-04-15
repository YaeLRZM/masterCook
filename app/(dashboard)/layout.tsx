import { ThemeProvider } from "@/context/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
