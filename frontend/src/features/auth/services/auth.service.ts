import axios from "axios";

const API_URL =
  "http://127.0.0.1:8000";

export async function signIn(data: {
  email: string;
  password: string;
}) {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    data
  );

  return response.data;
}