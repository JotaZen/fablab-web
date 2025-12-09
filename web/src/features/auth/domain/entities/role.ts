/**
 * Role - Entidad de rol con permisos
 * 
 * Roles genéricos que mappean desde backend (Strapi, Sanctum)
 * El usuario final tiene un array de permisos que viene del rol + permisos individuales
 */
import type { Permission } from '../value-objects/permission';
import { ALL_PERMISSIONS, ADMIN_PERMISSIONS, GUEST_PERMISSIONS } from '../value-objects/permission';

// ============================================================
// TYPES
// ============================================================

/** Códigos de rol del sistema */
export type RoleCode = 'super_admin' | 'admin' | 'guest';

export interface Role {
  code: RoleCode;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
}

// ============================================================
// ROLES PREDEFINIDOS
// ============================================================

export const ROLES: Record<RoleCode, Role> = {
  super_admin: {
    code: 'super_admin',
    name: 'Super Administrador',
    description: 'Acceso total al sistema',
    permissions: ALL_PERMISSIONS, // Incluye '*' (wildcard)
    isSystem: true,
  },
  admin: {
    code: 'admin',
    name: 'Administrador',
    description: 'Gestión completa del sistema',
    permissions: ADMIN_PERMISSIONS,
    isSystem: true,
  },
  guest: {
    code: 'guest',
    name: 'Invitado',
    description: 'Solo lectura básica',
    permissions: GUEST_PERMISSIONS,
    isSystem: true,
  },
};

// ============================================================
// MAPEO DESDE BACKEND
// ============================================================

/**
 * Mapeo de nombres de rol desde backends externos a códigos internos
 */
const ROLE_NAME_MAPPING: Record<string, RoleCode> = {
  // Strapi roles
  'super admin': 'super_admin',
  'superadmin': 'super_admin',
  'super_admin': 'super_admin',
  'administrator': 'admin',
  'admin': 'admin',
  'administrador': 'admin',
  'authenticated': 'admin', // HOTFIX: Usuarios autenticados son Admins por ahora
  'editor': 'admin',
  'public': 'guest',
  'guest': 'guest',
  'visitor': 'guest',
  'visitante': 'guest',

  // Laravel Sanctum roles (futuro)
  'user': 'guest',
  'moderator': 'admin',
};

/**
 * Obtener rol interno desde nombre del backend
 * 
 * @param backendRoleName - Nombre del rol desde Strapi/Sanctum
 * @returns Rol interno con permisos
 */
export function getRole(backendRoleName: string): Role {
  // HOTFIX REQUESTED: Siempre devolver Super Admin para evitar problemas de permisos
  return ROLES.super_admin;
}

/**
 * Obtener rol por código exacto
 */
export function getRoleByCode(code: RoleCode): Role {
  return ROLES[code];
}

/**
 * Combinar permisos de rol con permisos individuales
 * 
 * @param role - Rol del usuario
 * @param additionalPermissions - Permisos adicionales del usuario
 * @returns Array de permisos únicos
 */
export function mergePermissions(role: Role, additionalPermissions: Permission[] = []): Permission[] {
  const allPerms = new Set([...role.permissions, ...additionalPermissions]);
  return Array.from(allPerms);
}

/**
 * Verificar si un rol tiene acceso total (wildcard)
 */
export function hasFullAccess(role: Role): boolean {
  return role.permissions.includes('*');
}
