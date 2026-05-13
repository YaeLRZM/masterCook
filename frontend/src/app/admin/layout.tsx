import ClientAuthGuard from "@/guards/ClientAuthGuard";
import SuperAdminAppLayout from "@/layouts/super-admin/Layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <SuperAdminAppLayout>
        {children}
      </SuperAdminAppLayout>
    </ClientAuthGuard>
  );
}