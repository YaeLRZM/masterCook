"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MoreHorizontal,
  Search,
  UserCheck,
  Shield,
  ChefHat,
  Eye,
  X,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  ClipboardList,
  Power,
  UserPlus,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = "Admin" | "Chef" | "Supervisor" | "Viewer";
type Status = "Activo" | "Inactivo";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastSeen: string;
  initials: string;
  color: string;
};

type ModalState =
  | { type: "create" }
  | { type: "edit"; user: User }
  | { type: "delete"; user: User }
  | null;

// ── Schema ────────────────────────────────────────────────────────────────────

const userSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(60, "Máximo 60 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  role: z.enum(["Admin", "Chef", "Supervisor", "Viewer"]),
  status: z.enum(["Activo", "Inactivo"]),
});

type UserFormValues = z.infer<typeof userSchema>;

// ── Config ────────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ElementType; badge: string; avatar: string }> = {
  Admin:      { label: "Admin",      icon: Shield,    badge: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400",     avatar: "bg-brand-500"   },
  Chef:       { label: "Chef",       icon: ChefHat,   badge: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400", avatar: "bg-orange-500"  },
  Supervisor: { label: "Supervisor", icon: UserCheck, badge: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400", avatar: "bg-success-500" },
  Viewer:     { label: "Viewer",     icon: Eye,       badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",           avatar: "bg-gray-400"    },
};

const INITIAL_USERS: User[] = [
  { id: "1", name: "Yael Ríos",      email: "yael@mastercook.mx",    role: "Admin",      status: "Activo",   lastSeen: "Hace 2 minutos", initials: "YR", color: "bg-brand-500"   },
  { id: "2", name: "Sofía Méndez",   email: "sofia@mastercook.mx",   role: "Chef",       status: "Activo",   lastSeen: "Hace 1 hora",    initials: "SM", color: "bg-orange-500"  },
  { id: "3", name: "Carlos Vega",    email: "carlos@mastercook.mx",  role: "Chef",       status: "Activo",   lastSeen: "Hace 3 horas",   initials: "CV", color: "bg-success-500" },
  { id: "4", name: "Mariana López",  email: "mariana@mastercook.mx", role: "Supervisor", status: "Activo",   lastSeen: "Ayer",           initials: "ML", color: "bg-warning-500" },
  { id: "5", name: "Diego Herrera",  email: "diego@mastercook.mx",   role: "Viewer",     status: "Inactivo", lastSeen: "Hace 5 días",    initials: "DH", color: "bg-gray-400"    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function nextId(): string {
  return Date.now().toString(36);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const { label, icon: Icon, badge } = ROLE_CONFIG[role];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-error-600 dark:text-error-400">
          <AlertTriangle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors";
const inputNormal = "border-gray-200 dark:border-gray-800 focus:ring-brand-500 focus:border-brand-500";
const inputError  = "border-error-500 dark:border-error-500 focus:ring-error-500 focus:border-error-500";

// ── UserFormModal ─────────────────────────────────────────────────────────────

function UserFormModal({
  mode,
  user,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  user?: User;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name:   user?.name   ?? "",
      email:  user?.email  ?? "",
      role:   user?.role   ?? "Chef",
      status: user?.status ?? "Activo",
    },
  });

  const isCreate = mode === "create";

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isCreate ? "Nuevo usuario" : "Editar usuario"}
      className="max-w-md mx-4"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
        <Field label="Nombre completo" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Ej. Sofía Méndez"
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
        </Field>

        <Field label="Correo electrónico" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="correo@mastercook.mx"
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
        </Field>

        <Field label="Rol" error={errors.role?.message}>
          <select
            {...register("role")}
            className={`${inputBase} ${errors.role ? inputError : inputNormal}`}
          >
            {(Object.keys(ROLE_CONFIG) as Role[]).map((r) => (
              <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
            ))}
          </select>
        </Field>

        {!isCreate && (
          <Field label="Estado" error={errors.status?.message}>
            <select
              {...register("status")}
              className={`${inputBase} ${errors.status ? inputError : inputNormal}`}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </Field>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            {isCreate ? <UserPlus size={14} /> : <Pencil size={14} />}
            {isCreate ? "Crear usuario" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── DeleteConfirmModal ────────────────────────────────────────────────────────

function DeleteConfirmModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen onClose={onClose} className="max-w-sm mx-4" showCloseButton={false}>
      <div className="px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-error-50 dark:bg-error-500/10 flex items-center justify-center shrink-0">
            <Trash2 size={16} className="text-error-600 dark:text-error-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Eliminar usuario</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ¿Confirmas eliminar a{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
              ? Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-error-600 text-white hover:bg-error-700 transition-colors"
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── ActionMenu ────────────────────────────────────────────────────────────────

function ActionMenu({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  onAudit,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onAudit: () => void;
}) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const action = (fn: () => void) => () => { fn(); close(); };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute right-0 top-8 z-20 w-48 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-md py-1 overflow-hidden">
            <button
              onClick={action(onEdit)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Pencil size={13} className="text-gray-400" />
              Editar usuario
            </button>
            <button
              onClick={action(onAudit)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ClipboardList size={13} className="text-gray-400" />
              Ver auditoría
            </button>
            <button
              onClick={action(onToggleStatus)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Power size={13} className="text-gray-400" />
              {user.status === "Activo" ? "Desactivar cuenta" : "Activar cuenta"}
            </button>
            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
            <button
              onClick={action(onDelete)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/5 transition-colors"
            >
              <Trash2 size={13} />
              Eliminar usuario
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [query, setQuery]   = useState("");
  const [modal, setModal]   = useState<ModalState>(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  const handleCreate = (values: UserFormValues) => {
    const { avatar } = ROLE_CONFIG[values.role];
    const newUser: User = {
      id:       nextId(),
      name:     values.name,
      email:    values.email,
      role:     values.role,
      status:   values.status,
      lastSeen: "Ahora",
      initials: getInitials(values.name),
      color:    avatar,
    };
    setUsers((prev) => [newUser, ...prev]);
    setModal(null);
  };

  const handleEdit = (values: UserFormValues) => {
    if (modal?.type !== "edit") return;
    const { avatar } = ROLE_CONFIG[values.role];
    setUsers((prev) =>
      prev.map((u) =>
        u.id === modal.user.id
          ? { ...u, ...values, initials: getInitials(values.name), color: avatar }
          : u
      )
    );
    setModal(null);
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setUsers((prev) => prev.filter((u) => u.id !== modal.user.id));
    setModal(null);
  };

  const handleToggleStatus = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "Activo" ? "Inactivo" : "Activo" }
          : u
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Usuarios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {users.filter((u) => u.status === "Activo").length} activos · {users.length} en total
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            <Plus size={13} />
            Nuevo usuario
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {["Usuario", "Rol", "Estado", "Última actividad", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
              >
                {/* Avatar + name */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-semibold shrink-0`}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white leading-tight">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-3.5">
                  <RoleBadge role={user.role} />
                </td>

                {/* Status */}
                <td className="px-6 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      user.status === "Activo"
                        ? "text-success-600 dark:text-success-400"
                        : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.status === "Activo"
                          ? "bg-success-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                    {user.status}
                  </span>
                </td>

                {/* Last seen */}
                <td className="px-6 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                  {user.lastSeen}
                </td>

                {/* Actions */}
                <td className="px-6 py-3.5 text-right">
                  <ActionMenu
                    user={user}
                    onEdit={() => setModal({ type: "edit", user })}
                    onDelete={() => setModal({ type: "delete", user })}
                    onToggleStatus={() => handleToggleStatus(user)}
                    onAudit={() => router.push("/admin/audit")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-14 flex flex-col items-center gap-2 text-center">
            <Search size={20} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No se encontraron usuarios{query ? ` para "${query}"` : ""}.
            </p>
            {query && (
              <button onClick={() => setQuery("")} className="text-xs text-brand-500 hover:underline">
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">
            {filtered.length} de {users.length} usuarios
          </span>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "create" && (
        <UserFormModal mode="create" onClose={() => setModal(null)} onSubmit={handleCreate} />
      )}

      {modal?.type === "edit" && (
        <UserFormModal
          mode="edit"
          user={modal.user}
          onClose={() => setModal(null)}
          onSubmit={handleEdit}
        />
      )}

      {modal?.type === "delete" && (
        <DeleteConfirmModal
          user={modal.user}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
