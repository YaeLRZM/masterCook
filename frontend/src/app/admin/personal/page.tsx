"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Eye, EyeOff } from "lucide-react";
import { getPersonal, createPersonal, disablePersonal, getAssignableRoles } from "@/features/personal/services/personal.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function roleColor(role: string) {
  switch (role) {
    case "CHEF":
      return "default";
    case "AUXILIAR":
      return "secondary";
    case "SALES":
      return "outline";
    default:
      return "outline";
  }
}

export default function PersonalPage() {
  const { user: currentUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    nombre_login: "",
    email: "",
    password: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    roles_ids: [] as number[],
  });

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await getPersonal();
      setStaff(data);
    } catch (error) {
      console.error("Error cargando personal:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getAssignableRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
  };

  useEffect(() => {
    loadStaff();
    loadRoles();
  }, []);

  const handleCreateStaff = async () => {
    try {
      await createPersonal({
        nombre_login: form.nombre_login,
        email: form.email,
        password: form.password,
        nombre: form.nombre || form.nombre_login,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        telefono: form.telefono,
        roles_ids: form.roles_ids,
      });
      setOpen(false);
      setForm({
        nombre_login: "",
        email: "",
        password: "",
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        telefono: "",
        roles_ids: [],
      });
      await loadStaff();
    } catch (error: any) {
      console.error("Error creando personal:", error);
      const message =
        error?.response?.data?.detail ?? error?.message ?? "Error creando personal";
      alert(message);
    }
  };

  const handleDisable = async (userId: number) => {
    try {
      await disablePersonal(userId);
      await loadStaff();
    } catch (error) {
      console.error("Error desactivando personal:", error);
      alert("Error desactivando personal");
    }
  };

  const staffWithoutCurrent = staff.filter(
    (s) => s.email !== currentUser?.email && !s.roles.includes("SUPER_ADMIN")
  );

  const filteredStaff = staffWithoutCurrent.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: staffWithoutCurrent.length,
    active: staffWithoutCurrent.filter((s) => s.status === "ACTIVE").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Personal"
          description="Administra el personal de tu empresa"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Crear Personal
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Empleado</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
                <Input
                  placeholder="Apellido paterno"
                  value={form.apellido_paterno}
                  onChange={(e) =>
                    setForm({ ...form, apellido_paterno: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Apellido materno"
                  value={form.apellido_materno}
                  onChange={(e) =>
                    setForm({ ...form, apellido_materno: e.target.value })
                  }
                />
                <Input
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />
              </div>

              <Input
                placeholder="Nombre de usuario"
                value={form.nombre_login}
                onChange={(e) =>
                  setForm({ ...form, nombre_login: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <div className="relative">
                <Input
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rol</label>
                <Select
                  value={form.roles_ids[0]?.toString() || ""}
                  onValueChange={(value) =>
                    setForm({ ...form, roles_ids: value ? [parseInt(value)] : [] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role: any) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleCreateStaff}>
                Guardar Empleado
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Personal Total</p>
            <h2 className="mt-2 text-3xl font-bold">{stats.total}</h2>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Personal Activo</p>
            <h2 className="mt-2 text-3xl font-bold">{stats.active}</h2>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar empleado..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                    No hay personal registrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{member.fullName}</p>
                        <p className="text-xs text-gray-500">@{member.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.roles.length > 0
                          ? member.roles.map((role: string) => (
                              <Badge key={role} variant={roleColor(role) as any}>
                                {role}
                              </Badge>
                            ))
                          : <span className="text-xs text-gray-500">Sin roles</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === "ACTIVE" ? "default" : "destructive"}>
                        {member.status === "ACTIVE" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDisable(member.id)}
                      >
                        Desactivar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
