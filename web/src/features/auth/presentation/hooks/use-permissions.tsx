"use client";

/**
 * usePermissions - Hook para verificar permisos
 */

import { useCallback, useMemo } from "react";
import type { Permission } from "../../domain/value-objects/permission";
import type { RoleCode } from "../../domain/entities/role";
import { hasPermission, hasAnyPermission, isAdmin } from "../../domain/services/authorization-service";
import { useAuth } from "../providers/auth.provider";

export interface UsePermissionsResult {
  /** Verifica si el usuario tiene un permiso específico */
  can: (permission: Permission) => boolean;
  /** Verifica si tiene cualquiera de los permisos */
  canAny: (permissions: Permission[]) => boolean;
  /** Verifica si el usuario tiene un rol específico */
  hasRole: (role: RoleCode) => boolean;
  /** Verifica si es administrador */
  isAdmin: boolean;
  /** Lista de permisos efectivos del usuario */
  permissions: Permission[];
  /** Rol actual del usuario */
  roleCode: RoleCode | null;
}

export function usePermissions(): UsePermissionsResult {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    return user?.role.permissions ?? [];
  }, [user]);

  const can = useCallback((permission: Permission) => {
    return hasPermission(user, permission);
  }, [user]);

  const canAny = useCallback((perms: Permission[]) => {
    return hasAnyPermission(user, perms);
  }, [user]);

  const checkRole = useCallback((role: RoleCode) => {
    return user?.role.code === role;
  }, [user]);

  const isAdminUser = useMemo(() => {
    return isAdmin(user);
  }, [user]);

  return {
    can,
    canAny,
    hasRole: checkRole,
    isAdmin: isAdminUser,
    permissions,
    roleCode: user?.role.code ?? null,
  };
}
