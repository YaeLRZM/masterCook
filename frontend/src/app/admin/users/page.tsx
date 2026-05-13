"use client";

import { useState } from "react";

import { companyUsers } from "@/mocks/company-users.mock";

import PageHeader from "@/components/common/PageHeader";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

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

export default function AdminUsersPage() {
  const [search, setSearch] =
    useState("");

  const filteredUsers =
    companyUsers.filter((user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <PageHeader
          title="Company Users"
          description="Manage your company staff"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create Employee
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input placeholder="Full name" />

              <Input placeholder="Email" />

              <Input placeholder="Password" />

              <select className="w-full rounded-md border p-2 text-sm">
                <option>
                  Select Role
                </option>

                <option value="CHEF">
                  Chef
                </option>

                <option value="AUXILIAR">
                  Auxiliar
                </option>

                <option value="SALES">
                  Sales
                </option>
              </select>

              <Button className="w-full">
                Save Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
  <Card className="rounded-3xl border-0 shadow-sm">
    <CardContent className="p-6">
      <p className="text-sm text-gray-500">
        Total Employees
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {companyUsers.length}
      </h2>
    </CardContent>
  </Card>

  <Card className="rounded-3xl border-0 shadow-sm">
    <CardContent className="p-6">
      <p className="text-sm text-gray-500">
        Chefs
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {
          companyUsers.filter(
            (u) => u.role === "CHEF"
          ).length
        }
      </h2>
    </CardContent>
  </Card>

  <Card className="rounded-3xl border-0 shadow-sm">
    <CardContent className="p-6">
      <p className="text-sm text-gray-500">
        Auxiliars
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {
          companyUsers.filter(
            (u) =>
              u.role === "AUXILIAR"
          ).length
        }
      </h2>
    </CardContent>
  </Card>

  <Card className="rounded-3xl border-0 shadow-sm">
    <CardContent className="p-6">
      <p className="text-sm text-gray-500">
        Sales
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {
          companyUsers.filter(
            (u) => u.role === "SALES"
          ).length
        }
      </h2>
    </CardContent>
  </Card>
</div>

      {/* SEARCH */}

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search employee..."
              className="pl-10"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}

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
                  Role
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map(
                (user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={roleColor(
                          user.role
                        ) as any}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          user.status ===
                          "ACTIVE"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                        >
                          Disable
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}