import ClientAuthGuard from "@/guards/ClientAuthGuard";
import AuxiliarAppLayout from "@/layouts/auxiliar/Layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <AuxiliarAppLayout>
        {children}
      </AuxiliarAppLayout>
    </ClientAuthGuard>
  );
}