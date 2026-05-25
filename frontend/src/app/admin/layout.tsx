import ClientAuthGuard from "@/guards/ClientAuthGuard";
import AdminLayout from "@/layouts/admin/Layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ClientAuthGuard>
  );
}