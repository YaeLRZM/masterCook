import { api } from "@/lib/axios";

import { AuthUser } from "@/types/api.types";
import { Role } from "@/types/role.types";

// --- Tipos crudos que devuelve el backend (FastAPI) ----------------------

interface BackendUsuario {
  id: number;
  empresa_id: number | null;
  persona_id: number | null;
  nombre_login: string;
  email: string;
  estatus: string;
  activo: boolean;
}

interface BackendLoginResponse {
  access_token: string;
  token_type: string;
  usuario: BackendUsuario;
  roles: string[];
}

// --- Salida normalizada para el frontend ---------------------------------

export interface SignInResult {
  token: string;
  user: AuthUser;
  roles: Role[];
}

// Prioridad para elegir UN rol primario cuando el usuario tiene varios.
// El rol primario decide a que dashboard se redirige despues del login.
const ROLE_PRIORITY: Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.CHEF,
  Role.AUXILIAR,
  Role.SALES,
];

function pickPrimaryRole(roles: Role[]): Role | null {
  for (const candidate of ROLE_PRIORITY) {
    if (roles.includes(candidate)) return candidate;
  }
  return roles[0] ?? null;
}

// Filtra los strings del backend y los castea al enum del frontend.
// Cualquier rol que no este en el enum se ignora silenciosamente.
function normalizeRoles(raw: string[]): Role[] {
  const valid = new Set<string>(Object.values(Role));
  return raw.filter((r) => valid.has(r)) as Role[];
}

function adapt(response: BackendLoginResponse): SignInResult {
  const roles = normalizeRoles(response.roles);
  const primary = pickPrimaryRole(roles);

  if (!primary) {
    throw new Error(
      "Tu usuario no tiene roles validos asignados. Pide a tu administrador que te asigne uno."
    );
  }

  const user: AuthUser = {
    id: response.usuario.id,
    name: response.usuario.nombre_login,
    email: response.usuario.email,
    role: primary,
    companyId: response.usuario.empresa_id ?? undefined,
    isActive: response.usuario.activo,
  };

  return {
    token: response.access_token,
    user,
    roles,
  };
}

export async function signIn(data: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const { data: payload } = await api.post<BackendLoginResponse>(
    "/auth/login",
    data
  );
  return adapt(payload);
}
