import { api } from "@/lib/axios";

export async function getAdmins() {
  const response = await api.get(
    "/users/admins"
  );

  return response.data;
}

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  company_id: number;
}) {
  const response = await api.post(
    "/users/admins",
    {
      ...data,
      role: "ADMIN",
    }
  );

  return response.data;
}