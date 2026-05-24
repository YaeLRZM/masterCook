import { api } from "@/lib/axios";

// --- Tipo crudo del backend ----------------------------------------------

interface BackendAdministrador {
  id: number;
  nombre: string;            // nombre_login
  email: string;
  empresa: string;           // nombre de la empresa
  empresa_id: number;
  estatus: string;
  activo: boolean;
  telefono: string | null;
}

// --- Tipo normalizado para la UI -----------------------------------------

export interface Admin {
  id: number;
  name: string;
  email: string;
  company: string;
  company_id: number;
  role: "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  phone?: string;
}

function adapt(row: BackendAdministrador): Admin {
  return {
    id: row.id,
    name: row.nombre,
    email: row.email,
    company: row.empresa,
    company_id: row.empresa_id,
    role: "ADMIN",
    status: row.activo ? "ACTIVE" : "INACTIVE",
    phone: row.telefono ?? undefined,
  };
}

// --- Endpoints ------------------------------------------------------------

export async function getAdmins(): Promise<Admin[]> {
  const { data } = await api.get<BackendAdministrador[]>(
    "/empresas/administradores/"
  );
  return data.map(adapt);
}

/**
 * Crea el ADMIN/Representante de una empresa.
 * Backend: POST /empresas/{empresa_id}/admin
 */
export async function createAdmin(payload: {
  name: string;                  // nombre de pila (Persona.nombre y nombre_login)
  email: string;
  password: string;
  company_id: number;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  cargo?: string;
}) {
  if (!payload.company_id || Number.isNaN(payload.company_id)) {
    throw new Error("Selecciona una empresa antes de crear el administrador.");
  }
  if (!payload.name || payload.name.trim().length < 2) {
    throw new Error("El nombre debe tener al menos 2 caracteres.");
  }
  if (!payload.password || payload.password.length < 6) {
    throw new Error("El password debe tener al menos 6 caracteres.");
  }

  const { data } = await api.post(
    `/empresas/${payload.company_id}/admin`,
    {
      nombre_login: payload.name,
      email: payload.email,
      password: payload.password,
      nombre: payload.name,
      apellido_paterno: payload.apellido_paterno || undefined,
      apellido_materno: payload.apellido_materno || undefined,
      telefono: payload.telefono || undefined,
      cargo: payload.cargo || "Representante Legal",
    }
  );
  return data;
}
