"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import {
  createAdmin,
  getAdmins,
  toggleAdminStatus,
} from "@/features/users/services/users.service";

import { getCompanies } from "@/features/companies/services/companies.service";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";

function roleColor(role: string) {
  switch (role) {
    case "ADMIN":
      return "default";

    case "CHEF":
      return "secondary";

    case "SALES":
      return "outline";

    case "AUXILIAR":
      return "secondary";

    default:
      return "outline";
  }
}

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const [users, setUsers] =
    useState<any[]>([]);

  const [companies, setCompanies] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    email: "",
    password: "",
    company_id: "",
  });

  const loadData = async () => {
    const usersData = await getAdmins();
    const companiesData =
      await getCompanies();

    setUsers(usersData);
    setCompanies(companiesData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async () => {
    try {
      await createAdmin({
        name: form.name,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        telefono: form.telefono,
        email: form.email,
        password: form.password,
        company_id: Number(form.company_id),
      });

      await loadData();

      setForm({
        name: "",
        apellido_paterno: "",
        apellido_materno: "",
        telefono: "",
        email: "",
        password: "",
        company_id: "",
      });

      setOpen(false);
    } catch (error: any) {
      console.error(error);
      const detail =
        error?.response?.data?.detail ??
        error?.message ??
        "Error creating admin";
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => `${d.loc?.join(".")}: ${d.msg}`).join("\n")
          : JSON.stringify(detail);
      alert(message);
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    try {
      const action = currentStatus === "ACTIVE" ? "suspender" : "activar";
      if (confirm(`¿Deseas ${action} este administrador?`)) {
        await toggleAdminStatus(userId);
        await loadData();
      }
    } catch (error: any) {
      console.error(error);
      alert("Error al cambiar el estado del administrador");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Administradores de Empresa"
          description="Administra los administradores de cada empresa"
        />

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Crear Administrador
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Crear Administrador
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Apellido paterno"
                  value={form.apellido_paterno}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      apellido_paterno: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Apellido materno"
                  value={form.apellido_materno}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      apellido_materno: e.target.value,
                    })
                  }
                />
              </div>

              <Input
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e) =>
                  setForm({
                    ...form,
                    telefono: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <select
                className="w-full rounded-md border p-2 text-sm"
                value={form.company_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    company_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Seleccionar empresa
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Input
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <Button
                className="w-full"
                onClick={handleCreateUser}
              >
                Guardar Administrador
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Buscar administradores..."
              className="pl-10"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Nombre
                </TableHead>

                <TableHead>
                  Email
                </TableHead>

                <TableHead>
                  Teléfono
                </TableHead>

                <TableHead>
                  Empresa
                </TableHead>

                <TableHead>
                  Rol
                </TableHead>

                <TableHead>
                  Estado
                </TableHead>

                <TableHead>
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>

                  <TableCell>
                    {user.phone || "—"}
                  </TableCell>

                  <TableCell>
                    {user.company}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        roleColor(user.role) as any
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        user.status === "ACTIVE"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {user.status === "ACTIVE"
                        ? "Activo"
                        : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant={
                        user.status === "ACTIVE"
                          ? "destructive"
                          : "default"
                      }
                      onClick={() =>
                        handleToggleStatus(
                          user.id,
                          user.status
                        )
                      }
                    >
                      {user.status === "ACTIVE"
                        ? "Suspender"
                        : "Activar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-gray-500"
                  >
                    No hay administradores encontrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}