"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
} from "lucide-react";
import {
  getIngredientes,
  deleteIngrediente,
  type Ingrediente,
} from "@/features/chef/services/ingredientes.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const datos = await getIngredientes();
        setIngredientes(datos);
      } catch (error) {
        console.error("Error cargando ingredientes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarIngredientes();
  }, []);

  const handleEliminar = async (id: number) => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este ingrediente?"
      )
    ) {
      try {
        await deleteIngrediente(id);
        setIngredientes(
          ingredientes.filter((i) => i.id !== id)
        );
      } catch (error) {
        console.error("Error eliminando ingrediente:", error);
        alert("Error al eliminar el ingrediente");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Ingredientes"
          description="Administra todos los ingredientes"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingrediente
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Ingrediente</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input placeholder="Nombre del ingrediente" />
              <Input placeholder="Descripción" />
              <Input
                placeholder="Costo unitario"
                type="number"
                step="0.01"
              />
              <Button className="w-full">Guardar Ingrediente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando ingredientes...</p>
        </div>
      ) : ingredientes.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <AlertCircle className="mr-2 h-5 w-5" />
          <p>No hay ingredientes registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Descripción
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Costo Unitario
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Unidad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((ingrediente) => (
                <tr
                  key={ingrediente.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {ingrediente.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ingrediente.descripcion || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                    ${ingrediente.costo_unitario.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ingrediente.unidad_medida || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg border border-orange-200 p-2 text-orange-600 hover:bg-orange-50"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(ingrediente.id)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
