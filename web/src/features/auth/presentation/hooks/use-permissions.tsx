"use client";

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAuth } from '@/shared/auth/useAuth';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  getPermissionsForRoles,
  type Permission,
  PERMISSIONS 
} from '../../domain/permissions';

interface PermissionsContextValue {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManagePosts: boolean;
  canManageInventory: boolean;
  canControlIoT: boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const value = useMemo<PermissionsContextValue>(() => {
    // Obtener permisos basado en roles del usuario
    const userRoles = user?.roles || [];
    const permissions = getPermissionsForRoles(userRoles);

    return {
      permissions,
      hasPermission: (p) => hasPermission(permissions, p),
      hasAnyPermission: (ps) => hasAnyPermission(permissions, ps),
      hasAllPermissions: (ps) => hasAllPermissions(permissions, ps),
      // Shortcuts comunes
      canAccessAdmin: hasPermission(permissions, PERMISSIONS.ADMIN_ACCESS),
      canManageUsers: hasAnyPermission(permissions, [
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.USERS_EDIT,
      ]),
      canManagePosts: hasAnyPermission(permissions, [
        PERMISSIONS.POSTS_VIEW,
        PERMISSIONS.POSTS_CREATE,
        PERMISSIONS.POSTS_EDIT,
      ]),
      canManageInventory: hasAnyPermission(permissions, [
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_CREATE,
        PERMISSIONS.INVENTORY_EDIT,
      ]),
      canControlIoT: hasAnyPermission(permissions, [
        PERMISSIONS.IOT_VIEW,
        PERMISSIONS.IOT_CONTROL,
      ]),
    };
  }, [user?.roles]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextValue {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe usarse dentro de PermissionsProvider');
  }
  return context;
}

// ==================== COMPONENTES DE PROTECCIÓN ====================

interface RequirePermissionProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Muestra children solo si el usuario tiene el permiso
 */
export function RequirePermission({ permission, children, fallback = null }: RequirePermissionProps) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

interface RequireAnyPermissionProps {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Muestra children si el usuario tiene al menos uno de los permisos
 */
export function RequireAnyPermission({ permissions, children, fallback = null }: RequireAnyPermissionProps) {
  const { hasAnyPermission } = usePermissions();
  
  if (!hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Re-export permissions para conveniencia
export { PERMISSIONS } from '../../domain/permissions';
