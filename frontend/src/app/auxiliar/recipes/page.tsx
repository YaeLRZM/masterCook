"use client";

import { useEffect, useState } from "react";
import { ChefHat, CheckCircle2, Circle, Search, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getRecetas, type Receta } from "@/features/chef/services/recetas.service";
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
      const { data } = await api.get<RecetaDetalles>(`/recetas/${recetaId}/detalles`);
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
        if (receta.procedimiento) {
          const pasos = receta.procedimiento
            .split("\n")
            .filter((p) => p.trim().length > 0);
          steps[receta.id] = new Array(pasos.length).fill(false);
        }
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
  const paginatedRecetas = filteredRecetas.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando recetas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Recetas de Cocina</h1>
        <p className="mt-2 text-gray-500">Selecciona una receta para seguir paso a paso</p>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar receta..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* TABLA DE RECETAS */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Porciones</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pasos</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Costo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progreso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRecetas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay recetas disponibles
                  </td>
                </tr>
              ) : (
                paginatedRecetas.map((receta) => {
                  const pasos = receta.procedimiento
                    ? receta.procedimiento
                        .split("\n")
                        .filter((p) => p.trim().length > 0)
                    : [];
                  const completados = completedSteps[receta.id] || [];
                  const progreso =
                    pasos.length > 0
                      ? Math.round(
                          (completados.filter(Boolean).length / pasos.length) * 100
                        )
                      : 0;

                  return (
                    <tr key={receta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{receta.nombre}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {receta.rendimiento_porciones}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pasos.length}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                        ${receta.costo_total_calculado.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all"
                              style={{ width: `${progreso}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{progreso}%</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => cargarDetallesReceta(receta.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition"
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
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {startIdx + 1} a {Math.min(startIdx + ITEMS_PER_PAGE, filteredRecetas.length)} de {filteredRecetas.length} recetas
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition ${
                    page === currentPage
                      ? "bg-orange-600 text-white font-semibold"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLES */}
      {selectedReceta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">{selectedReceta.nombre}</h2>
              <button
                onClick={() => setSelectedReceta(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Imagen */}
              <div className="relative h-64 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center overflow-hidden">
                {selectedReceta.imagen_url ? (
                  <img
                    src={`${API_URL}${selectedReceta.imagen_url}`}
                    alt={selectedReceta.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ChefHat className="h-20 w-20 text-orange-300" />
                )}
              </div>

              {/* Info básica */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Porciones</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedReceta.rendimiento_porciones}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Pasos</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedReceta.procedimiento
                      ? selectedReceta.procedimiento.split("\n").filter((p) => p.trim()).length
                      : 0}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Costo Total</p>
                  <p className="text-2xl font-bold text-orange-600">${selectedReceta.costo_total_calculado.toFixed(2)}</p>
                </div>
              </div>

              {/* Procedimiento */}
              {selectedReceta.procedimiento && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Procedimiento</h3>
                  <div className="space-y-3">
                    {selectedReceta.procedimiento
                      .split("\n")
                      .filter((p) => p.trim())
                      .map((paso, idx) => {
                        const completado = completedSteps[selectedReceta.id]?.[idx] || false;
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleStep(selectedReceta.id, idx)}
                            className="w-full flex items-start gap-3 p-4 hover:bg-orange-50 rounded-xl border border-gray-100 text-left transition"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {completado ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                              ) : (
                                <Circle className="h-6 w-6 text-gray-300" />
                              )}
                            </div>
                            <p className={`text-base ${completado ? "text-gray-400 line-through" : "text-gray-800"}`}>
                              {paso.trim()}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Ingredientes */}
              {selectedReceta.ingredientes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Ingredientes</h3>
                  <div className="space-y-2">
                    {selectedReceta.ingredientes.map((ing, idx) => (
                      <div key={idx} className="flex justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{ing.nombre}</p>
                          <p className="text-xs text-gray-500">${ing.costo_base.toFixed(2)} base</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{ing.cantidad} {ing.unidad_medida}</p>
                          <p className="text-sm text-orange-600 font-semibold">${ing.subtotal.toFixed(2)}</p>
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
