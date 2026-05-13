"use client";

import { useEffect } from "react";

import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { user, token, setAuth } =
    useAuthStore();

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (
      storedToken &&
      storedUser &&
      !user
    ) {
      setAuth(
        JSON.parse(storedUser),
        storedToken
      );
    }
  }, [user, setAuth]);

  return {
    user,
    token,
  };
};