import { Role } from "./role.types";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  companyId?: number;
  isActive: boolean;
}