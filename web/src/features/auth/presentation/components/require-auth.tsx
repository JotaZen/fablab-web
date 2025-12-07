"use client";

/**
 * RequireAuth - Protege rutas requiriendo autenticación
 */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { RoleCode } from "../../domain/entities/role";
import { useAuth } from "../providers/auth.provider";

interface RequireAuthProps {
  children: React.ReactNode;
  /** Ruta a redirigir si no está autenticado */
  redirectTo?: string;
  /** Roles requeridos (cualquiera de ellos) */
  roles?: RoleCode[];
  /** Componente a mostrar mientras carga */
  fallback?: React.ReactNode;
}

export function RequireAuth({
  children,
  redirectTo = "/login",
  roles,
  fallback = null
}: RequireAuthProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Loading
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check roles if specified
  if (roles && roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role.code) ||
      user.role.code === 'super_admin' ||
      user.role.code === 'admin';

    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No tienes permisos para ver esta página</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
