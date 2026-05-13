import { Role } from "@/types/role.types";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}