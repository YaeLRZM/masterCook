/**
 * Audit Log Helper
 * Writes a record to AuditLog for any create/update/delete action.
 */

import { prisma } from "./db";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

interface AuditParams {
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId?: string;
  userName?: string;
  fieldName?: string;
  before?: unknown;
  after?: unknown;
  recipeId?: string;
  eventId?: string;
}

export async function logAudit(params: AuditParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action as any,
      userId: params.userId,
      userName: params.userName,
      fieldName: params.fieldName,
      before: params.before != null ? JSON.stringify(params.before) : null,
      after: params.after != null ? JSON.stringify(params.after) : null,
      recipeId: params.recipeId,
      eventId: params.eventId,
    },
  });
}
