"use client";

import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getPersonal } = await import("@/features/personal/services/personal.service");
        const { getAuditorias } = await import("@/features/dashboard/services/dashboard.service");

        const staff = await getPersonal();
        setStaffCount(staff.length);
        setActiveCount(staff.filter((s) => s.status === "ACTIVE").length);

        const audits = await getAuditorias();
        setAuditorias(audits);
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
          <h2 className="text-lg font-semibold mb-4">
            Auditoría de Actividades
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Últimas 50 actividades registradas en tu empresa
          </p>

          {auditorias.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay actividades registradas aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Tabla</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditorias.map((audit) => (
                    <TableRow key={audit.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(audit.fecha).toLocaleDateString()} {new Date(audit.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-sm">
                        ID: {audit.hecho_por}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            audit.tipo_movimiento === "INSERT"
                              ? "default"
                              : audit.tipo_movimiento === "UPDATE"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {audit.tipo_movimiento}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {audit.nombre_tabla}
                      </TableCell>
                      <TableCell className="text-sm max-w-md truncate">
                        {audit.descripcion || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}