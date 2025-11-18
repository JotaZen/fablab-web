"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Si no hay sesión, ir al login
      router.push("/admin");
    }
  }, [loading, user, router]);

  if (loading) return <div className="mt-16">Cargando sesión...</div>;
  if (!user) return null; // El router se encarga de redirigir

  return <>{children}</>;
}
