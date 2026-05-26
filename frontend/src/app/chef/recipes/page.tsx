"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Plus, ChefHat, Edit2, Trash2, X, Clock, Users } from "lucide-react";
import { getRecetas, deleteReceta, createReceta, updateReceta, type Receta } from "@/features/chef/services/recetas.service";
import { getIngredientes, type Ingrediente } from "@/features/chef/services/ingredientes.service";
import { getUnidadesMedida, type UnidadMedida } from "@/features/chef/services/unidades.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    procedimiento: "",
    rendimiento_porciones: 1,
    es_subreceta: false,
    ingredientes: [] as Array<{
      ingrediente_id: number;
      unidad_medida_id: number;
      cantidad: number;
    }>,
  });
  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    ingrediente_id: 0,
    unidad_medida_id: 1,
    cantidad: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [recetasData, ingredientesData, unidadesData] = await Promise.all([
        getRecetas(),
        getIngredientes(),
        getUnidadesMedida(),
      ]);
      setRecetas(recetasData);
      setIngredientes(ingredientesData);
      setUnidades(unidadesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarIngrediente = () => {
    if (nuevoIngrediente.ingrediente_id === 0 || nuevoIngrediente.cantidad <= 0) {
      alert("Completa los datos del ingrediente");
      return;
    }
    setForm({
      ...form,
      ingredientes: [...form.ingredientes, nuevoIngrediente],
    });
    setNuevoIngrediente({
      ingrediente_id: 0,
      unidad_medida_id: 1,
      cantidad: 0,
    });
  };

  const handleQuitarIngrediente = (index: number) => {
    setForm({
      ...form,
      ingredientes: form.ingredientes.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      procedimiento: "",
      rendimiento_porciones: 1,
      es_subreceta: false,
      ingredientes: [],
    });
    setEditingId(null);
    setNuevoIngrediente({
      ingrediente_id: 0,
      unidad_medida_id: 1,
      cantidad: 0,
    });
  };

  const handleGuardar = async () => {
    if (!form.nombre || form.rendimiento_porciones <= 0) {
      alert("Por favor completa los datos requeridos");
      return;
    }

    try {
      if (editingId) {
        await updateReceta(editingId, {
          nombre: form.nombre,
          procedimiento: form.procedimiento,
          rendimiento_porciones: form.rendimiento_porciones,
          es_subreceta: form.es_subreceta,
          ingredientes: form.ingredientes,
        });
      } else {
        await createReceta({
          nombre: form.nombre,
          procedimiento: form.procedimiento,
          rendimiento_porciones: form.rendimiento_porciones,
          es_subreceta: form.es_subreceta,
          ingredientes: form.ingredientes,
        });
      }

      resetForm();
      setOpen(false);
      await cargarDatos();
    } catch (error) {
      console.error("Error guardando receta:", error);
      alert("Error al guardar la receta");
    }
  };

  const handleEditar = (receta: Receta) => {
    setForm({
      nombre: receta.nombre,
      procedimiento: receta.procedimiento,
      rendimiento_porciones: receta.rendimiento_porciones,
      es_subreceta: receta.es_subreceta || false,
      ingredientes: receta.ingredientes || [],
    });
    setEditingId(receta.id);
    setOpen(true);
  };

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
      <div className="flex items-center justify-between">
        <PageHeader
          title="Recetas"
          description="Administra todas las recetas de la cocina"
        />

        <Dialog open={open} onOpenChange={(newOpen) => {
          if (!newOpen) resetForm();
          setOpen(newOpen);
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Receta
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Receta" : "Crear Nueva Receta"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre de la Receta *</label>
                <Input
                  placeholder="Ej: Arroz con Pollo"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Procedimiento</label>
                <textarea
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={4}
                  placeholder="Describe los pasos..."
                  value={form.procedimiento}
                  onChange={(e) =>
                    setForm({ ...form, procedimiento: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Rendimiento (porciones) *</label>
                  <Input
                    type="number"
                    min="1"
                    value={form.rendimiento_porciones}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rendimiento_porciones: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.es_subreceta}
                      onChange={(e) =>
                        setForm({ ...form, es_subreceta: e.target.checked })
                      }
                    />
                    <span className="text-sm">Es sub-receta</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Ingredientes</h3>

                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Ingrediente
                      </label>
                      <select
                        className="w-full border rounded p-2 text-sm"
                        value={nuevoIngrediente.ingrediente_id}
                        onChange={(e) =>
                          setNuevoIngrediente({
                            ...nuevoIngrediente,
                            ingrediente_id: parseInt(e.target.value) || 0,
                          })
                        }
                      >
                        <option value={0}>Seleccionar...</option>
                        {ingredientes.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Unidad
                      </label>
                      <select
                        className="w-full border rounded p-2 text-sm"
                        value={nuevoIngrediente.unidad_medida_id}
                        onChange={(e) =>
                          setNuevoIngrediente({
                            ...nuevoIngrediente,
                            unidad_medida_id: parseInt(e.target.value) || 1,
                          })
                        }
                      >
                        {unidades.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nombre} ({u.abreviatura})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Cantidad
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={nuevoIngrediente.cantidad}
                        onChange={(e) =>
                          setNuevoIngrediente({
                            ...nuevoIngrediente,
                            cantidad: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAgregarIngrediente}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Ingrediente
                  </Button>
                </div>

                {form.ingredientes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600">
                      Ingredientes agregados:
                    </h4>
                    {form.ingredientes.map((ing, idx) => {
                      const ingrediente = ingredientes.find(
                        (i) => i.id === ing.ingrediente_id
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                        >
                          <span>
                            {ingrediente?.nombre} - {ing.cantidad}
                          </span>
                          <button
                            onClick={() => handleQuitarIngrediente(idx)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={handleGuardar}>
                Guardar Receta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recetas.map((receta) => (
            <div
              key={receta.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="h-44 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden relative">
                {receta.imagen_url ? (
                  <img
                    src={receta.imagen_url}
                    alt={receta.nombre}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.currentTarget.parentElement?.querySelector(".fallback-icon") as HTMLElement).style.display = "flex";
                    }}
                  />
                ) : null}
                <div className="fallback-icon flex items-center justify-center h-full w-full absolute">
                  <ChefHat className="h-16 w-16 text-orange-300" />
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{receta.nombre}</h2>
                  {receta.procedimiento && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {receta.procedimiento}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-orange-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Costo</p>
                    <p className="font-semibold text-orange-600 text-sm">${receta.costo_total_calculado.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <Users className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="font-semibold text-blue-600 text-sm">{receta.rendimiento_porciones}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">{receta.ingredientes?.length || 0}</p>
                    <p className="font-semibold text-green-600 text-xs">ingredientes</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/chef/recipes/${receta.id}`}
                    className="flex-1 rounded-lg bg-blue-100 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    Ver Detalle
                  </Link>
                  <button
                    onClick={() => handleEditar(receta)}
                    className="flex-1 rounded-lg bg-orange-100 py-2 text-sm font-medium text-orange-600 hover:bg-orange-200 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(receta.id)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 transition-colors"
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
