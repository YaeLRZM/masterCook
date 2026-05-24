"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import {
  createCompany,
  getCompanies,
  toggleCompanyStatus,
} from "@/features/companies/services/companies.service";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type Company = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  rfc?: string;
  is_active: boolean;
};

export default function CompaniesPage() {
  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [search, setSearch] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      rfc: "",
    });

  const loadCompanies = async () => {
    const data = await getCompanies();
    setCompanies(data);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreateCompany = async () => {
    try {
      setLoading(true);

      await createCompany(form);

      await loadCompanies();

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        rfc: "",
      });

      setOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(extractApiError(error, "Error creating company"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (
    companyId: number
  ) => {
    try {
      await toggleCompanyStatus(companyId);
      await loadCompanies();
    } catch (error: any) {
      console.error(error);
      alert(extractApiError(error, "Error updating company status"));
    }
  };

  function extractApiError(error: any, fallback: string): string {
    const detail = error?.response?.data?.detail ?? error?.message ?? fallback;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((d: any) => `${d.loc?.join(".")}: ${d.msg}`).join("\n");
    }
    return JSON.stringify(detail);
  }

  const filteredCompanies =
    companies.filter((company) =>
      company.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Companies"
          description="Manage all registered companies"
        />

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create Company
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create Company
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Company name"
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

              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
              />

              <Input
                placeholder="RFC"
                value={form.rfc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rfc: e.target.value.toUpperCase(),
                  })
                }
              />

              <Button
                className="w-full"
                onClick={handleCreateCompany}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Company"}
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
              placeholder="Search companies..."
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
                  Company
                </TableHead>

                <TableHead>
                  Email
                </TableHead>

                <TableHead>
                  Phone
                </TableHead>

                <TableHead>
                  Address
                </TableHead>

                <TableHead>
                  RFC
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
              {filteredCompanies.map(
                (company) => (
                  <TableRow
                    key={company.id}
                  >
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>

                    <TableCell>
                      {company.email}
                    </TableCell>

                    <TableCell>
                      {company.phone || "—"}
                    </TableCell>

                    <TableCell>
                      {company.address || "—"}
                    </TableCell>

                    <TableCell>
                      {company.rfc || "—"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          company.is_active
                            ? "default"
                            : "destructive"
                        }
                      >
                        {company.is_active
                          ? "ACTIVE"
                          : "SUSPENDED"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant={
                          company.is_active
                            ? "destructive"
                            : "outline"
                        }
                        onClick={() =>
                          handleToggleStatus(
                            company.id
                          )
                        }
                      >
                        {company.is_active
                          ? "Suspend"
                          : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}

              {filteredCompanies.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-gray-500"
                  >
                    No companies found.
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