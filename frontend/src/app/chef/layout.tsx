import ClientAuthGuard from "@/guards/ClientAuthGuard";
import ChefAppLayout from "@/layouts/chef/Layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <ChefAppLayout>
        {children}
      </ChefAppLayout>
    </ClientAuthGuard>
  );
}