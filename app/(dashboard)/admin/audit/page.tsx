import type { Metadata } from "next";
import { Shield, Plus, Pencil, Trash2, LogIn, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Auditoría — MasterCook Admin",
};

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "SETTINGS";

type AuditEntry = {
  id: string;
  action: AuditAction;
  actor: { name: string; initials: string; color: string };
  target: string;
  detail: string;
  timestamp: string;
  relative: string;
};

const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "1",
    action: "SETTINGS",
    actor: { name: "Yael Ríos", initials: "YR", color: "bg-brand-500" },
    target: "Diego Herrera",
    detail: "modificó los permisos de acceso de",
    timestamp: "2026-04-27 11:42",
    relative: "Hace 2 horas",
  },
  {
    id: "2",
    action: "CREATE",
    actor: { name: "Sofía Méndez", initials: "SM", color: "bg-orange-500" },
    target: "Risotto de langosta",
    detail: "creó la receta",
    timestamp: "2026-04-27 10:15",
    relative: "Hace 4 horas",
  },
  {
    id: "3",
    action: "UPDATE",
    actor: { name: "Carlos Vega", initials: "CV", color: "bg-success-500" },
    target: "Pechuga de pollo",
    detail: "actualizó el precio de ingrediente",
    timestamp: "2026-04-27 09:00",
    relative: "Hace 5 horas",
  },
  {
    id: "4",
    action: "LOGIN",
    actor: { name: "Mariana López", initials: "ML", color: "bg-warning-500" },
    target: "MasterCook",
    detail: "inició sesión en",
    timestamp: "2026-04-27 08:30",
    relative: "Hace 5 horas",
  },
  {
    id: "5",
    action: "DELETE",
    actor: { name: "Yael Ríos", initials: "YR", color: "bg-brand-500" },
    target: "Evento Draft — Graduación López",
    detail: "eliminó el borrador",
    timestamp: "2026-04-26 18:00",
    relative: "Ayer, 18:00",
  },
  {
    id: "6",
    action: "CREATE",
    actor: { name: "Yael Ríos", initials: "YR", color: "bg-brand-500" },
    target: "Diego Herrera",
    detail: "invitó al equipo al usuario",
    timestamp: "2026-04-26 14:22",
    relative: "Ayer, 14:22",
  },
  {
    id: "7",
    action: "UPDATE",
    actor: { name: "Sofía Méndez", initials: "SM", color: "bg-orange-500" },
    target: "Boda García — Cotización",
    detail: "actualizó la cotización del evento",
    timestamp: "2026-04-25 11:10",
    relative: "Hace 2 días",
  },
];

const ACTION_CONFIG: Record<AuditAction, { icon: React.ElementType; classes: string; dot: string }> = {
  CREATE: {
    icon: Plus,
    classes: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400",
    dot: "bg-success-500",
  },
  UPDATE: {
    icon: Pencil,
    classes: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
    dot: "bg-brand-500",
  },
  DELETE: {
    icon: Trash2,
    classes: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400",
    dot: "bg-error-500",
  },
  LOGIN: {
    icon: LogIn,
    classes: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    dot: "bg-gray-400",
  },
  SETTINGS: {
    icon: Settings,
    classes: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400",
    dot: "bg-warning-500",
  },
};

function TimelineEntry({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const { icon: Icon, classes, dot } = ACTION_CONFIG[entry.action];

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${classes}`}>
          <Icon size={14} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-2 bg-gray-100 dark:bg-gray-800" />}
      </div>

      {/* Content */}
      <div className={`pb-6 flex-1 min-w-0 ${isLast ? "" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`w-5 h-5 rounded-full ${entry.actor.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
              {entry.actor.initials}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
              <span className="font-medium text-gray-900 dark:text-white">{entry.actor.name}</span>
              {" "}{entry.detail}{" "}
              <span className="font-medium text-gray-900 dark:text-white">{entry.target}</span>
            </p>
          </div>
          <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap mt-0.5">{entry.relative}</span>
        </div>
        <p className="mt-1 ml-7 text-xs text-gray-400">{entry.timestamp}</p>
      </div>
    </div>
  );
}

export default function AdminAuditPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Auditoría</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Registro de actividad del equipo y cambios del sistema</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
          <Shield size={13} />
          Acceso Admin
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Últimas {MOCK_AUDIT.length} acciones
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success-500" />Creación</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-500" />Edición</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-error-500" />Eliminación</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warning-500" />Permisos</span>
          </div>
        </div>

        <div>
          {MOCK_AUDIT.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} isLast={i === MOCK_AUDIT.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
