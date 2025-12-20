/**
 * AuthorizationService - Lógica de permisos
 * 
 * Usa el nuevo sistema de permisos con formato module.resource.operation:scope
 */
import { hasPermission as checkPermission, WILDCARD_PERMISSION, type Permission } from '../value-objects/permission';
import type { User } from '../entities/user';
import type { RoleCode } from '../entities/role';

/**
 * Verificar si un usuario tiene un permiso específico
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return checkPermission(user.role.permissions, permission);
}

/**
 * Verificar si un usuario tiene alguno de los permisos dados
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

/**
 * Verificar si un usuario tiene todos los permisos dados
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(user, p));
}

/**
 * Verificar si un usuario es admin (super_admin o admin)
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  const adminRoles: RoleCode[] = ['super_admin', 'admin'];
  return adminRoles.includes(user.role.code as RoleCode);
}

/**
 * Verificar si un usuario es editor
 * Nota: El sistema actual mapea 'editor' a 'admin', así que esta función
 * simplemente verifica si tiene permisos de administración.
 */
export function isEditor(user: User | null): boolean {
  // Por ahora, editor es equivalente a admin en el sistema de roles
  return isAdmin(user);
}

/**
 * Verificar si un usuario puede gestionar contenido (admin o editor)
 */
export function canManageContent(user: User | null): boolean {
  return isAdmin(user) || isEditor(user);
}

/**
 * Verificar si un usuario tiene acceso total (wildcard)
 */
export function hasFullAccess(user: User | null): boolean {
  if (!user) return false;
  return user.role.permissions.includes(WILDCARD_PERMISSION);
}
