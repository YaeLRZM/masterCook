"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/signin");
      }
    };

    checkAuth();

    window.addEventListener("pageshow", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("pageshow", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, [router]);

  return <>{children}</>;
}