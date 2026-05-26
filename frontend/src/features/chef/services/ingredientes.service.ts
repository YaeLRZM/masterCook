import { api } from "@/lib/axios";

export interface Ingrediente {
  id: number;
  nombre: string;
  costo_base: number;
  unidad_medida_id: number;
  peso_bruto: number;
  peso_neto: number;
  merma_porcentaje: number;
  stock: number;
  stock_minimo: number;
  imagen_url?: string;
  activo: boolean;
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
  costo_base: number;
  unidad_medida_id: number;
  peso_bruto?: number;
  peso_neto?: number;
  stock?: number;
  stock_minimo?: number;
  imagen_url?: string;
}): Promise<Ingrediente> {
  const { data } = await api.post<Ingrediente>("/ingredientes/", payload);
  return data;
}

export async function updateIngrediente(
  id: number,
  payload: Partial<{
    nombre: string;
    costo_base: number;
    unidad_medida_id: number;
    peso_bruto: number;
    peso_neto: number;
    stock: number;
    stock_minimo: number;
    imagen_url: string;
    activo: boolean;
  }>
): Promise<Ingrediente> {
  const { data } = await api.patch<Ingrediente>(`/ingredientes/${id}`, payload);
  return data;
}

export async function deleteIngrediente(id: number): Promise<void> {
  await api.delete(`/ingredientes/${id}`);
}
