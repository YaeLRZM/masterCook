"use client";

import { useEffect, useState } from "react";
import {
  ChefHat,
  CheckCircle2,
  Circle,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
} from "lucide-react";

import {
  getRecetas,
  type Receta,
} from "@/features/chef/services/recetas.service";

import { API_URL, api } from "@/lib/axios";

interface RecetaDetalles {
  id: number;
  nombre: string;
  procedimiento: string;
  rendimiento_porciones: number;
  imagen_url?: string;
  es_subreceta: boolean;
  costo_total_calculado: number;
  ingredientes: Array<{
    ingrediente_id: number;
    nombre: string;
    cantidad: number;
    unidad_medida: string;
    costo_base: number;
    merma_porcentaje: number;
    costo_unitario_efectivo: number;
    subtotal: number;
  }>;
}

const ITEMS_PER_PAGE = 10;

export default function AuxiliarRecipesPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean[]>>({});
  const [selectedReceta, setSelectedReceta] = useState<RecetaDetalles | null>(null);

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarDetallesReceta = async (recetaId: number) => {
    try {
      const { data } = await api.get<RecetaDetalles>(
        `/recetas/${recetaId}/detalles`
      );
      setSelectedReceta(data);
    } catch (error) {
      console.error("Error cargando detalles de receta:", error);
    }
  };

  const cargarRecetas = async () => {
    try {
      const data = await getRecetas();
      setRecetas(data);

      const steps: Record<number, boolean[]> = {};

      data.forEach((receta) => {
        const pasos = receta.procedimiento
          ? receta.procedimiento
              .split("\n")
              .filter((p) => p.trim().length > 0)
          : [];

        steps[receta.id] = new Array(pasos.length).fill(false);
      });

      setCompletedSteps(steps);
    } catch (error) {
      console.error("Error cargando recetas:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (recetaId: number, stepIndex: number) => {
    setCompletedSteps((prev) => {
      const newSteps = [...(prev[recetaId] || [])];
      newSteps[stepIndex] = !newSteps[stepIndex];

      return {
        ...prev,
        [recetaId]: newSteps,
      };
    });
  };

  const filteredRecetas = recetas.filter((r) =>
    r.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecetas.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecetas = filteredRecetas.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const totalPasos = recetas.reduce((acc, receta) => {
    const pasos = receta.procedimiento
      ? receta.procedimiento
          .split("\n")
          .filter((p) => p.trim().length > 0).length
      : 0;

    return acc + pasos;
  }, 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Cargando recetas...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Recetas de Cocina
          </h1>

          <p className="mt-2 text-gray-500">
            Consulta instrucciones, ingredientes y pasos de preparación.
          </p>
        </div>

        <div className="hidden rounded-3xl bg-blue-600 p-5 text-white shadow-sm md:block">
          <p className="text-sm text-blue-100">
            Recetas disponibles
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            {recetas.length}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total recetas
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {recetas.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Pasos registrados
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {totalPasos}
          </h3>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Modo auxiliar
          </p>

          <h3 className="mt-2 text-lg font-semibold text-blue-600">
            Solo consulta
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />

          <input
            type="text"
            placeholder="Buscar receta..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              {[
                "Receta",
                "Porciones",
                "Pasos",
                "Costo",
                "Progreso",
                "Acción",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedRecetas.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No hay recetas disponibles.
                </td>
              </tr>
            ) : (
              paginatedRecetas.map((receta) => {
                const pasos = receta.procedimiento
                  ? receta.procedimiento
                      .split("\n")
                      .filter((p) => p.trim().length > 0)
                  : [];

                const completados =
                  completedSteps[receta.id] || [];

                const progreso =
                  pasos.length > 0
                    ? Math.round(
                        (completados.filter(Boolean).length /
                          pasos.length) *
                          100
                      )
                    : 0;

                return (
                  <tr
                    key={receta.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>

                        <p className="font-medium text-gray-900">
                          {receta.nombre}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {receta.rendimiento_porciones}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {pasos.length}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      ${receta.costo_total_calculado.toFixed(2)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all"
                            style={{ width: `${progreso}%` }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {progreso}%
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() =>
                          cargarDetallesReceta(receta.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {startIdx + 1} a{" "}
            {Math.min(startIdx + ITEMS_PER_PAGE, filteredRecetas.length)} de{" "}
            {filteredRecetas.length} recetas
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {selectedReceta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedReceta.nombre}
              </h2>

              <button
                onClick={() => setSelectedReceta(null)}
                className="rounded-xl p-2 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-50">
                {selectedReceta.imagen_url ? (
                  <img
                    src={`${API_URL}${selectedReceta.imagen_url}`}
                    alt={selectedReceta.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ChefHat className="h-20 w-20 text-blue-300" />
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">
                    Porciones
                  </p>

                  <p className="text-2xl font-bold text-blue-600">
                    {selectedReceta.rendimiento_porciones}
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">
                    Pasos
                  </p>

                  <p className="text-2xl font-bold text-blue-600">
                    {selectedReceta.procedimiento
                      ? selectedReceta.procedimiento
                          .split("\n")
                          .filter((p) => p.trim()).length
                      : 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">
                    Costo
                  </p>

                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedReceta.costo_total_calculado.toFixed(2)}
                  </p>
                </div>
              </div>

              {selectedReceta.procedimiento && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Procedimiento
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedReceta.procedimiento
                      .split("\n")
                      .filter((p) => p.trim())
                      .map((paso, idx) => {
                        const completado =
                          completedSteps[selectedReceta.id]?.[idx] ||
                          false;

                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              toggleStep(selectedReceta.id, idx)
                            }
                            className="flex w-full items-start gap-3 rounded-2xl border border-gray-100 p-4 text-left hover:bg-blue-50"
                          >
                            {completado ? (
                              <CheckCircle2 className="mt-1 h-6 w-6 text-green-600" />
                            ) : (
                              <Circle className="mt-1 h-6 w-6 text-gray-300" />
                            )}

                            <p
                              className={`text-base ${
                                completado
                                  ? "text-gray-400 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              {paso.trim()}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {selectedReceta.ingredientes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ingredientes
                  </h3>

                  <div className="mt-4 space-y-2">
                    {selectedReceta.ingredientes.map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between rounded-2xl border border-gray-100 p-4"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {ing.nombre}
                          </p>

                          <p className="text-xs text-gray-500">
                            ${ing.costo_base.toFixed(2)} base
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {ing.cantidad} {ing.unidad_medida}
                          </p>

                          <p className="text-sm font-semibold text-blue-600">
                            ${ing.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}