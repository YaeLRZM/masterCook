"use client";

import { useEffect, useState } from "react";
import { ChefHat, CheckCircle2, Circle } from "lucide-react";
import { getRecetas, type Receta } from "@/features/chef/services/recetas.service";
import { API_URL } from "@/lib/axios";

export default function AuxiliarRecipesPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean[]>>({});

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      const data = await getRecetas();
      setRecetas(data);
      // Inicializar pasos como no completados
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando recetas...</p>
      </div>
    );
  }

  if (recetas.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Recetas de Cocina</h1>
          <p className="mt-2 text-gray-500">
            Sigue las instrucciones paso a paso
          </p>
        </div>
        <div className="text-center py-12 text-gray-500">
          No hay recetas disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Recetas de Cocina</h1>
        <p className="mt-2 text-gray-500">
          Sigue las instrucciones paso a paso
        </p>
      </div>

      {/* RECIPES */}
      <div className="grid gap-8 lg:grid-cols-2">
        {recetas.map((receta) => {
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
            <div
              key={receta.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
                {receta.imagen_url ? (
                  <img
                    src={`${API_URL}${receta.imagen_url}`}
                    alt={receta.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ChefHat className="h-16 w-16 text-orange-300" />
                )}
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4">
                {/* Titulo y info basica */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {receta.nombre}
                  </h2>
                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {receta.rendimiento_porciones}
                      </span>{" "}
                      porciones
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {pasos.length}
                      </span>{" "}
                      pasos
                    </div>
                  </div>
                </div>

                {/* Progreso */}
                {pasos.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-600">
                      <span>Progreso</span>
                      <span>{progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Pasos */}
                {pasos.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Pasos
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {pasos.map((paso, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleStep(receta.id, idx)}
                          className="w-full flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          {completados[idx] ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`text-sm ${
                              completados[idx]
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {paso.trim()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sin procedimiento */}
                {pasos.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Sin procedimiento definido
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
