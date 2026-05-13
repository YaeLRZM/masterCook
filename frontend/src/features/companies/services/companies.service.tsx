import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("token");
}

export async function getCompanies() {
  const response = await axios.get(
    `${API_URL}/companies/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
}

export async function createCompany(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  const response = await axios.post(
    `${API_URL}/companies/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
}

export async function toggleCompanyStatus(id: number) {
  const response = await axios.patch(
    `${API_URL}/companies/${id}/toggle-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
}