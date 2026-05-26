import { api } from "@/lib/axios";

export interface Auditoria {
  id: number;
  empresa_id: number | null;
  hecho_por: number;
  nombre_tabla: string;
  id_tabla: number | null;
  tipo_movimiento: string;
  modulo: string | null;
  descripcion: string | null;
  ip: string | null;
  creado_en: string;
}

export async function getAuditorias(): Promise<Auditoria[]> {
  const { data } = await api.get<Auditoria[]>("/usuarios/auditorias/");
  return data;
}
