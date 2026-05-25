"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Building2,
  ShieldCheck,
  Ban,
  UserCog,
  Plus,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/cards/StatCard";

import {
  Company,
  getCompanies,
} from "@/features/companies/services/companies.service";
import {
  Admin,
  getAdmins,
} from "@/features/users/services/users.service";

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, a] = await Promise.all([
          getCompanies(),
          getAdmins(),
        ]);
        setCompanies(c);
        setAdmins(a);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- Metricas derivadas ------------------------------------------------

  const stats = useMemo(() => {
    const total = companies.length;
    const activas = companies.filter((c) => c.is_active).length;
    const suspendidas = total - activas;
    const adminsCount = admins.length;

    const empresasConAdmin = new Set(admins.map((a) => a.company_id)).size;
    const empresasSinAdmin = companies.filter(
      (c) => !admins.some((a) => a.company_id === c.id)
    );

    return {
      total,
      activas,
      suspendidas,
      adminsCount,
      empresasConAdmin,
      empresasSinAdmin,
      cobertura:
        total === 0 ? 0 : Math.round((empresasConAdmin / total) * 100),
    };
  }, [companies, admins]);

  const recientes = useMemo(() => {
    // Las empresas vienen en orden de insercion; tomamos las ultimas 5.
    return [...companies].slice(-5).reverse();
  }, [companies]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Resumen de empresas y administradores registrados"
      />

      {/* STATS REALES */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Empresas"
          value={loading ? "—" : String(stats.total)}
          icon={Building2}
        />

        <StatCard
          title="Activas"
          value={loading ? "—" : String(stats.activas)}
          icon={ShieldCheck}
        />

        <StatCard
          title="Suspendidas"
          value={loading ? "—" : String(stats.suspendidas)}
          icon={Ban}
        />

        <StatCard
          title="Administradores"
          value={loading ? "—" : String(stats.adminsCount)}
          icon={UserCog}
        />
      </div>

      {/* BENTO */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* COBERTURA DE ADMINS (panel grande) */}
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white xl:col-span-8">
          <p className="text-sm text-blue-100">
            Cobertura de administradores
          </p>

          <h2 className="mt-3 text-5xl font-bold tracking-tight">
            {loading ? "—" : `${stats.cobertura}%`}
          </h2>

          <p className="mt-4 max-w-md text-blue-100">
            Porcentaje de empresas registradas que ya tienen al menos un
            administrador asignado.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Con admin</p>
              <h3 className="mt-2 text-2xl font-bold">
                {loading ? "—" : stats.empresasConAdmin}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Sin admin</p>
              <h3 className="mt-2 text-2xl font-bold">
                {loading ? "—" : stats.empresasSinAdmin.length}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Total admins</p>
              <h3 className="mt-2 text-2xl font-bold">
                {loading ? "—" : stats.adminsCount}
              </h3>
            </div>
          </div>
        </div>

        {/* EMPRESAS SIN ADMIN (accion pendiente) */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 xl:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Empresas sin admin</h2>
            <Link
              href="/super-admin/users"
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
            >
              <Plus className="h-3 w-3" />
              Asignar
            </Link>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-gray-500">Cargando...</p>
          ) : stats.empresasSinAdmin.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">
              Todas las empresas tienen administrador asignado ✨
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {stats.empresasSinAdmin.slice(0, 6).map((empresa) => (
                <div
                  key={empresa.id}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
                  <div>
                    <p className="font-medium">{empresa.name}</p>
                    <p className="text-sm text-gray-500">{empresa.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EMPRESAS RECIENTES */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold">Empresas recientes</h2>

          <Link
            href="/super-admin/companies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Empresa", "Email", "RFC", "Estatus", "Admin"].map(
                (item) => (
                  <th
                    key={item}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500"
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Cargando...
                </td>
              </tr>
            )}

            {!loading && recientes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Aun no hay empresas registradas.
                </td>
              </tr>
            )}

            {!loading &&
              recientes.map((empresa) => {
                const tieneAdmin = admins.some(
                  (a) => a.company_id === empresa.id
                );
                return (
                  <tr
                    key={empresa.id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-5 font-medium">
                      {empresa.name}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {empresa.email}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {empresa.rfc || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          empresa.is_active
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {empresa.is_active ? "ACTIVA" : "SUSPENDIDA"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          tieneAdmin
                            ? "bg-blue-50 text-blue-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {tieneAdmin ? "Asignado" : "Pendiente"}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
