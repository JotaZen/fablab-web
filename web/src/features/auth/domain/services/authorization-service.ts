/**
 * AuthorizationService - Lógica de permisos
 */
import type { Permission } from '../value-objects/permission';
import type { User } from '../entities/user';

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.role.permissions.includes(permission)) return true;
  
  const [resource] = permission.split('.');
  const managePermission = `${resource}.manage` as Permission;
  return user.role.permissions.includes(managePermission);
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role.id === 'super_admin' || user.role.id === 'admin';
}
