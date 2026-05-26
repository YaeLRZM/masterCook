"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import {
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Upload,
  Package,
} from "lucide-react";
import {
  getIngredientes,
  deleteIngrediente,
  createIngrediente,
  updateIngrediente,
  uploadIngredienteImage,
  type Ingrediente,
} from "@/features/chef/services/ingredientes.service";
import {
  getUnidadesMedida,
  type UnidadMedida,
} from "@/features/chef/services/unidades.service";
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
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
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
      const [datos, unidadesData] = await Promise.all([
        getIngredientes(),
        getUnidadesMedida(),
      ]);
      setIngredientes(datos);
      setUnidades(unidadesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
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
      let ingredienteId: number;

      if (editingId) {
        const result = await updateIngrediente(editingId, {
          nombre: form.nombre,
          costo_base: form.costo_base,
          unidad_medida_id: form.unidad_medida_id,
          peso_bruto: form.peso_bruto,
          peso_neto: form.peso_neto,
          stock: form.stock,
          stock_minimo: form.stock_minimo,
        });
        ingredienteId = result.id;
      } else {
        const result = await createIngrediente({
          nombre: form.nombre,
          costo_base: form.costo_base,
          unidad_medida_id: form.unidad_medida_id,
          peso_bruto: form.peso_bruto,
          peso_neto: form.peso_neto,
          stock: form.stock,
          stock_minimo: form.stock_minimo,
        });
        ingredienteId = result.id;
      }

      // Si hay un archivo de imagen, lo subimos
      if (imagenFile) {
        try {
          await uploadIngredienteImage(ingredienteId, imagenFile);
        } catch (imageError) {
          console.error("Error subiendo imagen:", imageError);
          alert("Se guardó el ingrediente pero hubo error al subir la imagen");
        }
      }

      resetForm();
      setImagenFile(null);
      setOpen(false);
      await cargarIngredientes();
    } catch (error) {
      console.error("Error guardando ingrediente:", error);
      alert("Error al guardar el ingrediente");
    }
  };

  const handleEditar = (ingrediente: Ingrediente) => {
    setForm({
      nombre: ingrediente.nombre,
      costo_base: ingrediente.costo_base,
      unidad_medida_id: ingrediente.unidad_medida_id || 1,
      peso_bruto: ingrediente.peso_bruto,
      peso_neto: ingrediente.peso_neto,
      stock: ingrediente.stock,
      stock_minimo: ingrediente.stock_minimo,
      imagen_url: ingrediente.imagen_url || "",
    });
    setEditingId(ingrediente.id);
    setOpen(true);
  };

  const resetForm = () => {
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
    setEditingId(null);
    setImagenFile(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpen(true);
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

        <Dialog open={open} onOpenChange={(newOpen) => {
          if (!newOpen) resetForm();
          setOpen(newOpen);
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingrediente
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Ingrediente" : "Agregar Ingrediente"}</DialogTitle>
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
                  <select
                    className="w-full border rounded-lg p-2 text-sm"
                    value={form.unidad_medida_id}
                    onChange={(e) =>
                      setForm({ ...form, unidad_medida_id: parseInt(e.target.value) || 1 })
                    }
                  >
                    {unidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.abreviatura})
                      </option>
                    ))}
                  </select>
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
                <label className="text-sm font-medium">Imagen (opcional)</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagenFile(file);
                      }
                    }}
                    className="flex-1 border rounded-lg p-2 text-sm"
                  />
                  {imagenFile && (
                    <div className="text-sm text-green-600 py-2 px-3 bg-green-50 rounded-lg">
                      {imagenFile.name}
                    </div>
                  )}
                </div>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ingredientes.map((ingrediente) => (
            <div
              key={ingrediente.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
                {ingrediente.imagen_url ? (
                  <img
                    src={ingrediente.imagen_url}
                    alt={ingrediente.nombre}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                <Package className="h-12 w-12 text-orange-300" />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">{ingrediente.nombre}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-orange-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Costo Base</p>
                    <p className="font-semibold text-orange-600">${ingrediente.costo_base.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Merma</p>
                    <p className="font-semibold text-blue-600">{ingrediente.merma_porcentaje.toFixed(1)}%</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Stock</p>
                    <p className="font-semibold text-green-600">{ingrediente.stock.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Mínimo</p>
                    <p className="font-semibold text-gray-600">{ingrediente.stock_minimo.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleEditar(ingrediente)}
                    className="flex-1 rounded-lg bg-orange-100 py-2 px-3 text-sm font-medium text-orange-600 hover:bg-orange-200 transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4 inline mr-1" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminar(ingrediente.id)}
                    className="flex-1 rounded-lg bg-red-100 py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 inline mr-1" />
                    Eliminar
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
