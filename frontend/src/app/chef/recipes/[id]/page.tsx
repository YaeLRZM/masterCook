"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChefHat, ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/axios";
import { api } from "@/lib/axios";

interface IngredienteDesglose {
  ingrediente_id: number;
  nombre: string;
  cantidad: number;
  unidad_medida: string;
  costo_base: number;
  merma_porcentaje: number;
  costo_unitario_efectivo: number;
  subtotal: number;
}

interface RecetaDetalle {
  id: number;
  nombre: string;
  procedimiento?: string;
  rendimiento_porciones: number;
  imagen_url?: string;
  es_subreceta: boolean;
  costo_total_calculado: number;
  ingredientes: IngredienteDesglose[];
}

export default function RecetaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const recetaId = params.id as string;

  const [receta, setReceta] = useState<RecetaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarReceta();
  }, [recetaId]);

  const cargarReceta = async () => {
    try {
      const { data } = await api.get<RecetaDetalle>(`/recetas/${recetaId}/detalles`);
      setReceta(data);
    } catch (err) {
      console.error("Error cargando receta:", err);
      setError("Error al cargar los detalles de la receta");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando receta...</p>
      </div>
    );
  }

  if (error || !receta) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-4">{error || "Receta no encontrada"}</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{receta.nombre}</h1>
          {receta.es_subreceta && (
            <p className="text-sm text-orange-600 mt-1">Sub-receta</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Imagen y datos principales */}
        <div className="md:col-span-1 space-y-6">
          {/* Imagen */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 h-64 flex items-center justify-center relative">
            {receta.imagen_url ? (
              <img
                src={`${API_URL}${receta.imagen_url}`}
                alt={receta.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <ChefHat className="h-20 w-20 text-orange-300" />
            )}
          </div>

          {/* Datos principales */}
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Rendimiento</p>
              <p className="text-2xl font-bold text-orange-600">
                {receta.rendimiento_porciones} porciones
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Costo Total</p>
              <p className="text-2xl font-bold text-blue-600">
                ${receta.costo_total_calculado.toFixed(2)}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Costo por Porción</p>
              <p className="text-2xl font-bold text-green-600">
                ${(receta.costo_total_calculado / receta.rendimiento_porciones).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-2 space-y-8">
          {/* Procedimiento */}
          {receta.procedimiento && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Procedimiento
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {receta.procedimiento}
              </p>
            </div>
          )}

          {/* Tabla de ingredientes */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Ingredientes ({receta.ingredientes.length})
            </h2>

            {receta.ingredientes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay ingredientes agregados
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Ingrediente
                      </th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-700">
                        Cantidad
                      </th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-700">
                        Costo Unitario
                      </th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-700">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {receta.ingredientes.map((ing) => (
                      <tr key={ing.ingrediente_id} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-gray-900 font-medium">
                          {ing.nombre}
                          {ing.merma_porcentaje > 0 && (
                            <span className="text-xs text-red-600 ml-1">
                              ({ing.merma_porcentaje.toFixed(0)}% merma)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-700">
                          {ing.cantidad.toFixed(2)} {ing.unidad_medida}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-700">
                          ${ing.costo_unitario_efectivo.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-right font-semibold text-orange-600">
                          ${ing.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td colSpan={3} className="py-4 px-2 font-semibold text-gray-900">
                        COSTO TOTAL
                      </td>
                      <td className="py-4 px-2 text-right font-bold text-lg text-blue-600">
                        ${receta.costo_total_calculado.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
