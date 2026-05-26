"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Upload,
} from "lucide-react";
import {
  getIngredientes,
  deleteIngrediente,
  createIngrediente,
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
  const [form, setForm] = useState({
    nombre: "",
    costo_base: 0,
    unidad_medida_id: 1,
    peso_bruto: 0,
    peso_neto: 0,
    stock: 0,
    stock_minimo: 0,
    imagen_url: "",
  });

  useEffect(() => {
    cargarIngredientes();
  }, []);

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

  const handleGuardar = async () => {
    if (!form.nombre || form.costo_base <= 0) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      await createIngrediente({
        nombre: form.nombre,
        costo_base: form.costo_base,
        unidad_medida_id: form.unidad_medida_id,
        peso_bruto: form.peso_bruto,
        peso_neto: form.peso_neto,
        stock: form.stock,
        stock_minimo: form.stock_minimo,
        imagen_url: form.imagen_url || undefined,
      });

      setForm({
        nombre: "",
        costo_base: 0,
        unidad_medida_id: 1,
        peso_bruto: 0,
        peso_neto: 0,
        stock: 0,
        stock_minimo: 0,
        imagen_url: "",
      });

      setOpen(false);
      await cargarIngredientes();
    } catch (error) {
      console.error("Error guardando ingrediente:", error);
      alert("Error al guardar el ingrediente");
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este ingrediente?")) {
      try {
        await deleteIngrediente(id);
        setIngredientes(ingredientes.filter((i) => i.id !== id));
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
          description="Administra todos los ingredientes del inventario"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingrediente
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Ingrediente</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  placeholder="Ej: Pollo, Tomate, Aceite..."
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Costo Base ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.costo_base}
                    onChange={(e) =>
                      setForm({ ...form, costo_base: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Unidad de Medida</label>
                  <Input
                    type="number"
                    placeholder="ID de unidad"
                    value={form.unidad_medida_id}
                    onChange={(e) =>
                      setForm({ ...form, unidad_medida_id: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Peso Bruto (kg)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.peso_bruto}
                    onChange={(e) =>
                      setForm({ ...form, peso_bruto: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Peso Neto (kg)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.peso_neto}
                    onChange={(e) =>
                      setForm({ ...form, peso_neto: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stock Actual</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock Mínimo</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.stock_minimo}
                    onChange={(e) =>
                      setForm({ ...form, stock_minimo: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">URL de Imagen (opcional)</label>
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={form.imagen_url}
                  onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                />
              </div>

              <Button className="w-full" onClick={handleGuardar}>
                Guardar Ingrediente
              </Button>
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
                  Imagen
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Costo Base
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Merma %
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Stock
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
                  <td className="px-6 py-4">
                    {ingrediente.imagen_url ? (
                      <img
                        src={ingrediente.imagen_url}
                        alt={ingrediente.nombre}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {ingrediente.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                    ${ingrediente.costo_base.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ingrediente.merma_porcentaje.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ingrediente.stock.toFixed(2)}
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
