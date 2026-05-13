"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import {
  createAdmin,
  getAdmins,
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

  const [form, setForm] = useState({
    name: "",
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
        email: form.email,
        password: form.password,
        company_id: Number(form.company_id),
      });

      await loadData();

      setForm({
        name: "",
        email: "",
        password: "",
        company_id: "",
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error creating admin");
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
          title="Company Administrators"
          description="Manage company administrators"
        />

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create Admin
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
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
                  Select company
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

              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <Button
                className="w-full"
                onClick={handleCreateUser}
              >
                Save Admin
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
              placeholder="Search admins..."
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
                  Name
                </TableHead>

                <TableHead>
                  Email
                </TableHead>

                <TableHead>
                  Company
                </TableHead>

                <TableHead>
                  Role
                </TableHead>

                <TableHead>
                  Status
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
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
                    No admins found.
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