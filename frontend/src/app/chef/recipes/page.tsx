"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Plus, ChefHat, Edit2, Trash2 } from "lucide-react";
import { getRecetas, deleteReceta, type Receta } from "@/features/chef/services/recetas.service";

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        const datos = await getRecetas();
        setRecetas(datos);
      } catch (error) {
        console.error("Error cargando recetas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRecetas();
  }, []);

  const handleEliminar = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
      try {
        await deleteReceta(id);
        setRecetas(recetas.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Error eliminando receta:", error);
        alert("Error al eliminar la receta");
      }
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recetas"
        description="Administra todas las recetas de la cocina"
      />

      <div className="flex justify-end">
        <Link
          href="/chef/recipes/new"
          className="flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Nueva Receta
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando recetas...</p>
        </div>
      ) : recetas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay recetas registradas</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recetas.map((receta) => (
            <div
              key={receta.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                {receta.imagen_url ? (
                  <img
                    src={receta.imagen_url}
                    alt={receta.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ChefHat className="h-16 w-16 text-orange-400" />
                )}
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <h2 className="text-xl font-semibold">{receta.nombre}</h2>
                  {receta.descripcion && (
                    <p className="text-sm text-gray-500">{receta.descripcion}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Costo por porción</p>
                    <p className="font-semibold text-orange-600">
                      ${receta.costo_por_porcion.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Porciones</p>
                    <p className="font-semibold">{receta.porciones}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/chef/recipes/${receta.id}`}
                    className="flex-1 rounded-2xl border border-gray-200 py-3 text-center text-sm font-medium hover:bg-gray-50"
                  >
                    Ver Receta
                  </Link>
                  <button
                    onClick={() => {
                      /* TODO: Implementar edición */
                    }}
                    className="rounded-2xl border border-orange-200 p-3 text-orange-600 hover:bg-orange-50"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(receta.id)}
                    className="rounded-2xl border border-red-200 p-3 text-red-600 hover:bg-red-50"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}