"use client";

import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Icon className="h-7 w-7 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [staffCount, setStaffCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getPersonal } = await import("@/features/personal/services/personal.service");
        const staff = await getPersonal();
        setStaffCount(staff.length);
        setActiveCount(staff.filter((s) => s.status === "ACTIVE").length);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Resumen de tu empresa"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <StatCard
          title="Personal Total"
          value={loading ? "—" : staffCount}
          icon={Users}
        />

        <StatCard
          title="Personal Activo"
          value={loading ? "—" : activeCount}
          icon={UserCheck}
        />
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">
            Información de la Empresa
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Aquí se mostrarán los datos de tu empresa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}