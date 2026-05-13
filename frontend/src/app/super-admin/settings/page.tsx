import PageHeader from "@/components/common/PageHeader";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configuración del sistema"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-10">
        Settings module
      </div>
    </div>
  );
}