import { api } from "@/lib/axios";

interface BackendPersonal {
  id: number;
  nombre_login: string;
  email: string;
  estatus: string;
  activo: boolean;
  roles: string[];
  persona?: {
    nombre?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    telefono?: string;
  };
}

export interface Personal {
  id: number;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  roles: string[];
  fullName?: string;
  phone?: string;
}

function adapt(row: BackendPersonal): Personal {
  const fullName = row.persona
    ? [row.persona.nombre, row.persona.apellido_paterno, row.persona.apellido_materno]
        .filter(Boolean)
        .join(" ")
    : undefined;

  return {
    id: row.id,
    name: row.nombre_login,
    email: row.email,
    status: row.activo ? "ACTIVE" : "INACTIVE",
    roles: row.roles || [],
    fullName: fullName || row.nombre_login,
    phone: row.persona?.telefono,
  };
}

export async function getPersonal(): Promise<Personal[]> {
  const { data } = await api.get<BackendPersonal[]>("/usuarios/");
  return data.map(adapt);
}

export async function createPersonal(payload: {
  nombre_login: string;
  email: string;
  password: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  roles_ids?: number[];
}) {
  if (!payload.nombre_login || payload.nombre_login.trim().length < 2) {
    throw new Error("El nombre debe tener al menos 2 caracteres.");
  }
  if (!payload.email || payload.email.trim().length < 5) {
    throw new Error("El email es requerido.");
  }
  if (!payload.password || payload.password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  const { data } = await api.post("/usuarios/", {
    nombre_login: payload.nombre_login,
    email: payload.email,
    password: payload.password,
    nombre: payload.nombre || payload.nombre_login,
    apellido_paterno: payload.apellido_paterno,
    apellido_materno: payload.apellido_materno,
    telefono: payload.telefono,
    roles_ids: payload.roles_ids || [],
  });
  return data;
}

export async function assignRole(userId: number, roleId: number) {
  const { data } = await api.post(`/usuarios/${userId}/roles/${roleId}`);
  return data;
}

export async function removeRole(userId: number, roleId: number) {
  const { data } = await api.delete(`/usuarios/${userId}/roles/${roleId}`);
  return data;
}

export async function disablePersonal(userId: number) {
  const { data } = await api.delete(`/usuarios/${userId}`);
  return data;
}

export async function getAssignableRoles() {
  const { data } = await api.get("/usuarios/roles/");
  return data;
}

export async function createRole(payload: {
  nombre: string;
  descripcion?: string;
}) {
  const { data } = await api.post("/usuarios/roles/", {
    nombre: payload.nombre,
    descripcion: payload.descripcion,
  });
  return data;
}
