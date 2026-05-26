import { api } from "@/lib/axios";

export interface RecetaIngrediente {
  id: number;
  ingrediente_id: number;
  unidad_medida_id: number;
  cantidad: number;
}

export interface Receta {
  id: number;
  empresa_id: number;
  nombre: string;
  procedimiento?: string;
  rendimiento_porciones: number;
  imagen_url?: string;
  costo_total_calculado: number;
  es_subreceta: boolean;
  activa: boolean;
  ingredientes: RecetaIngrediente[];
}

export async function getRecetas(): Promise<Receta[]> {
  const { data } = await api.get<Receta[]>("/recetas/");
  return data;
}

export async function getReceta(id: number): Promise<Receta> {
  const { data } = await api.get<Receta>(`/recetas/${id}`);
  return data;
}

export async function createReceta(payload: {
  nombre: string;
  procedimiento?: string;
  rendimiento_porciones: number;
  es_subreceta?: boolean;
  ingredientes: Array<{
    ingrediente_id: number;
    unidad_medida_id: number;
    cantidad: number;
  }>;
}): Promise<Receta> {
  const { data } = await api.post<Receta>("/recetas/", payload);
  return data;
}

export async function updateReceta(
  id: number,
  payload: Partial<{
    nombre: string;
    procedimiento: string;
    rendimiento_porciones: number;
    es_subreceta: boolean;
    activa: boolean;
    ingredientes: Array<{
      ingrediente_id: number;
      unidad_medida_id: number;
      cantidad: number;
    }>;
  }>
): Promise<Receta> {
  const { data } = await api.patch<Receta>(`/recetas/${id}`, payload);
  return data;
}

export async function deleteReceta(id: number): Promise<void> {
  await api.delete(`/recetas/${id}`);
}

export async function uploadRecetaImage(
  id: number,
  file: File
): Promise<Receta> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<Receta>(`/recetas/${id}/imagen`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
