import { Permission } from "@/types/permission.types";
import { Role } from "@/types/role.types";

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    Permission.CREATE_COMPANY,
    Permission.UPDATE_COMPANY,
    Permission.DELETE_COMPANY,
    Permission.VIEW_COMPANIES,
    Permission.VIEW_USERS,
  ],

  [Role.ADMIN]: [
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.VIEW_USERS,
    Permission.VIEW_AUDIT,
  ],

  [Role.CHEF]: [
    Permission.CREATE_RECIPE,
    Permission.UPDATE_RECIPE,
    Permission.DELETE_RECIPE,
    Permission.VIEW_RECIPES,

    Permission.CREATE_INGREDIENT,
    Permission.UPDATE_INGREDIENT,
    Permission.DELETE_INGREDIENT,
    Permission.VIEW_INGREDIENTS,
  ],

  [Role.AUXILIAR]: [
    Permission.VIEW_RECIPES,
  ],

  [Role.SALES]: [
    Permission.CREATE_EVENT,
    Permission.UPDATE_EVENT,
    Permission.VIEW_EVENTS,

    Permission.CREATE_QUOTATION,
    Permission.VIEW_QUOTATIONS,
  ],
};