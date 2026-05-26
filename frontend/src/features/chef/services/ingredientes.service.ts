import { api } from "@/lib/axios";

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  costo_unitario: number;
  unidad_medida_id: number;
  unidad_medida?: string;
}

export async function getIngredientes(): Promise<Ingrediente[]> {
  const { data } = await api.get<Ingrediente[]>("/ingredientes/");
  return data;
}

export async function getIngrediente(id: number): Promise<Ingrediente> {
  const { data } = await api.get<Ingrediente>(`/ingredientes/${id}`);
  return data;
}

export async function createIngrediente(payload: {
  nombre: string;
  descripcion?: string;
  costo_unitario: number;
  unidad_medida_id: number;
}): Promise<Ingrediente> {
  const { data } = await api.post<Ingrediente>("/ingredientes/", payload);
  return data;
}

export async function updateIngrediente(
  id: number,
  payload: Partial<{
    nombre: string;
    descripcion?: string;
    costo_unitario: number;
    unidad_medida_id: number;
  }>
): Promise<Ingrediente> {
  const { data } = await api.patch<Ingrediente>(`/ingredientes/${id}`, payload);
  return data;
}

export async function deleteIngrediente(id: number): Promise<void> {
  await api.delete(`/ingredientes/${id}`);
}
