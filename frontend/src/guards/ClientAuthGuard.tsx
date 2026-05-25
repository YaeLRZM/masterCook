"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token) {
        router.replace("/signin");
        return;
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setAuth(user, token);
        } catch (e) {
          console.error("Failed to parse stored user:", e);
        }
      }
    };

    checkAuth();

    window.addEventListener("pageshow", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("pageshow", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, [router, setAuth]);

  return <>{children}</>;
}