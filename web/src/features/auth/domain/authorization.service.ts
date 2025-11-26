/**
 * ============================================================
 * DOMAIN - SERVICIOS DE AUTORIZACIÓN
 * ============================================================
 * 
 * Lógica de negocio para verificación de permisos.
 * Pura, sin dependencias externas.
 */

import type { ResolvedPermission, PermissionScope, AuthenticatedUser } from './entities';
import { PERMISSIONS } from './permissions.constants';

// ============================================================
// CONSTANTES
// ============================================================

/** Permiso wildcard que otorga acceso total */
const WILDCARD_PERMISSION = PERMISSIONS.SYSTEM_ALL;

// ============================================================
// AUTHORIZATION SERVICE
// ============================================================

/**
 * Verifica si el usuario tiene el permiso wildcard (acceso total)
 */
export function hasSuperPermission(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.permissions.some(p => p.id === WILDCARD_PERMISSION);
}

/**
 * Verifica si el usuario tiene un permiso específico
 */
export function hasPermission(
  user: AuthenticatedUser | null,
  permissionId: string,
  context?: { resourceOwnerId?: string | number; workspaceId?: string }
): boolean {
  if (!user) return false;

  // Si tiene permiso wildcard, tiene acceso a todo
  if (hasSuperPermission(user)) return true;

  const permission = user.permissions.find(p => p.id === permissionId);
  if (!permission) return false;

  return checkScope(permission, user.id, context);
}

/**
 * Verifica si el usuario tiene al menos uno de los permisos
 */
export function hasAnyPermission(
  user: AuthenticatedUser | null,
  permissionIds: string[],
  context?: { resourceOwnerId?: string | number; workspaceId?: string }
): boolean {
  if (!user) return false;
  return permissionIds.some(id => hasPermission(user, id, context));
}

/**
 * Verifica si el usuario tiene todos los permisos
 */
export function hasAllPermissions(
  user: AuthenticatedUser | null,
  permissionIds: string[],
  context?: { resourceOwnerId?: string | number; workspaceId?: string }
): boolean {
  if (!user) return false;
  return permissionIds.every(id => hasPermission(user, id, context));
}

/**
 * Verifica el scope de un permiso
 */
function checkScope(
  permission: ResolvedPermission,
  userId: string | number,
  context?: { resourceOwnerId?: string | number; workspaceId?: string }
): boolean {
  switch (permission.scope) {
    case 'global':
      return true;

    case 'workspace':
      // Si no hay contexto de workspace, se asume que es válido
      // (para FabLab es un solo workspace)
      if (!context?.workspaceId) return true;
      return permission.workspaceId === context.workspaceId;

    case 'own':
      // Si no hay contexto de owner, no podemos verificar
      if (context?.resourceOwnerId === undefined) return true;
      return String(userId) === String(context.resourceOwnerId);

    default:
      return false;
  }
}

/**
 * Filtra permisos por scope
 */
export function filterPermissionsByScope(
  permissions: ResolvedPermission[],
  scope: PermissionScope
): ResolvedPermission[] {
  return permissions.filter(p => p.scope === scope);
}

/**
 * Obtiene todos los IDs de permisos únicos
 */
export function getUniquePermissionIds(permissions: ResolvedPermission[]): string[] {
  return [...new Set(permissions.map(p => p.id))];
}

/**
 * Combina permisos de múltiples fuentes
 * Si un permiso aparece con diferentes scopes, se usa el más permisivo
 */
export function mergePermissions(
  ...permissionArrays: ResolvedPermission[][]
): ResolvedPermission[] {
  const scopePriority: Record<PermissionScope, number> = {
    global: 3,
    workspace: 2,
    own: 1,
  };

  const merged = new Map<string, ResolvedPermission>();

  for (const permissions of permissionArrays) {
    for (const permission of permissions) {
      const existing = merged.get(permission.id);
      
      if (!existing || scopePriority[permission.scope] > scopePriority[existing.scope]) {
        merged.set(permission.id, permission);
      }
    }
  }

  return Array.from(merged.values());
}

/**
 * Verifica si el usuario puede acceder al admin
 */
export function canAccessAdmin(user: AuthenticatedUser | null): boolean {
  return hasPermission(user, 'admin.dashboard.access');
}

/**
 * Obtiene las categorías de permisos que tiene el usuario
 */
export function getUserPermissionCategories(user: AuthenticatedUser | null): string[] {
  if (!user) return [];
  
  const categories = new Set<string>();
  for (const permission of user.permissions) {
    const [category] = permission.id.split('.');
    if (category) categories.add(category);
  }
  
  return Array.from(categories);
}

// ============================================================
// PERMISSION CHECKER - Clase para verificación fluida
// ============================================================

/**
 * Clase para verificar permisos de forma fluida
 * 
 * @example
 * const checker = new PermissionChecker(user);
 * if (checker.can('inventory.items.create').check()) { ... }
 * if (checker.canAny(['blog.posts.create', 'blog.posts.update']).check()) { ... }
 */
export class PermissionChecker {
  private user: AuthenticatedUser | null;
  private context?: { resourceOwnerId?: string | number; workspaceId?: string };

  constructor(user: AuthenticatedUser | null) {
    this.user = user;
  }

  /**
   * Establece el contexto para verificaciones de scope
   */
  withContext(context: { resourceOwnerId?: string | number; workspaceId?: string }): this {
    this.context = context;
    return this;
  }

  /**
   * Verifica un permiso específico
   */
  can(permissionId: string): { check: () => boolean } {
    return {
      check: () => hasPermission(this.user, permissionId, this.context),
    };
  }

  /**
   * Verifica si tiene alguno de los permisos
   */
  canAny(permissionIds: string[]): { check: () => boolean } {
    return {
      check: () => hasAnyPermission(this.user, permissionIds, this.context),
    };
  }

  /**
   * Verifica si tiene todos los permisos
   */
  canAll(permissionIds: string[]): { check: () => boolean } {
    return {
      check: () => hasAllPermissions(this.user, permissionIds, this.context),
    };
  }

  /**
   * Verifica acceso al admin
   */
  canAccessAdmin(): boolean {
    return canAccessAdmin(this.user);
  }
}
