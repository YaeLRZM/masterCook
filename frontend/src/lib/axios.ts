import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
});

// Adjunta el JWT en cada request.
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend devuelve 401, limpiamos sesion y mandamos a /signin.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "token=; path=/; max-age=0";
      if (!window.location.pathname.startsWith("/signin")) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);
