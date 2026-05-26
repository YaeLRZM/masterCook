import { api } from "@/lib/axios";

export interface UnidadMedida {
  id: number;
  nombre: string;
  abreviatura: string;
}

export async function getUnidadesMedida(): Promise<UnidadMedida[]> {
  const { data } = await api.get<UnidadMedida[]>("/unidades/");
  return data;
}

export async function getUnidadMedida(id: number): Promise<UnidadMedida> {
  const { data } = await api.get<UnidadMedida>(`/unidades/${id}`);
  return data;
}
