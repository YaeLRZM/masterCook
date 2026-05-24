import { api } from "@/lib/axios";

// --- Tipos crudos del backend (FastAPI) ----------------------------------

interface BackendEmpresa {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  rfc: string | null;
  estatus: string;
  activa: boolean;
  creado_en?: string | null;
}

// --- Tipo normalizado que consume la UI ----------------------------------

export interface Company {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  rfc?: string;
  is_active: boolean;
  status: string;
}

function adapt(e: BackendEmpresa): Company {
  return {
    id: e.id,
    name: e.nombre,
    email: e.email,
    phone: e.telefono ?? undefined,
    address: e.direccion ?? undefined,
    rfc: e.rfc ?? undefined,
    is_active: e.activa,
    status: e.estatus,
  };
}

// --- Endpoints ------------------------------------------------------------

export async function getCompanies(): Promise<Company[]> {
  const { data } = await api.get<BackendEmpresa[]>("/empresas/");
  return data.map(adapt);
}

export async function createCompany(payload: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  rfc?: string;
}): Promise<Company> {
  const { data } = await api.post<BackendEmpresa>("/empresas/", {
    nombre: payload.name,
    email: payload.email,
    telefono: payload.phone || undefined,
    direccion: payload.address || undefined,
    rfc: payload.rfc || undefined,
  });
  return adapt(data);
}

export async function toggleCompanyStatus(id: number): Promise<Company> {
  const { data } = await api.patch<BackendEmpresa>(
    `/empresas/${id}/toggle-status`
  );
  return adapt(data);
}

// --- Bootstrap del ADMIN de una empresa (solo SUPER_ADMIN) ---------------

export async function createCompanyAdmin(
  empresaId: number,
  payload: {
    nombre_login: string;
    email: string;
    password: string;
    nombre: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    telefono?: string;
    cargo?: string;
  }
) {
  const { data } = await api.post(
    `/empresas/${empresaId}/admin`,
    payload
  );
  return data;
}
