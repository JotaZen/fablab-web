"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  /** Ruta a la que redirigir si no está autenticado (default: /login) */
  redirectTo?: string;
  /** Componente a mostrar mientras carga */
  fallback?: ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * 
 * @example
 * ```tsx
 * <RequireAuth>
 *   <AdminDashboard />
 * </RequireAuth>
 * ```
 */
export function RequireAuth({ 
  children, 
  redirectTo = "/login",
  fallback,
}: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no está autenticado
    if (!isLoading && !isAuthenticated) {
      // Guardar la ruta actual para volver después del login
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${redirectTo}?returnUrl=${returnUrl}`);
    }
  }, [isLoading, isAuthenticated, router, pathname, redirectTo]);

  // Mientras carga, mostrar fallback o loading por defecto
  if (isLoading) {
    return fallback ?? (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (se está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
