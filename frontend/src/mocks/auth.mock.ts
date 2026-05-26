import { Role } from "@/types/role.types";

export const mockUsers = [
  {
    id: 1,
    email: "superadmin@test.com",
    password: "123456",
    role: Role.SUPER_ADMIN,
    name: "Super Admin",
    companyId: undefined,
    isActive: true,
  },

  {
    id: 2,
    email: "admin@test.com",
    password: "123456",
    role: Role.ADMIN,
    name: "Admin Empresa",
    companyId: 1,
    isActive: true,
  },

  {
    id: 3,
    email: "chef@test.com",
    password: "123456",
    role: Role.CHEF,
    name: "Chef",
    companyId: 1,
    isActive: true,
  },

  {
    id: 4,
    email: "auxiliar@test.com",
    password: "123456",
    role: Role.AYUDANTE_CHEF,
    name: "Auxiliar",
    companyId: 1,
    isActive: true,
  },

  {
    id: 5,
    email: "sales@test.com",
    password: "123456",
    role: Role.VENDEDOR,
    name: "Sales",
    companyId: 1,
    isActive: true,
  },
];