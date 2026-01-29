/**
 * Role - Entidad de rol con permisos
 * 
 * Roles genéricos que mappean desde backend (Strapi, Sanctum)
 * El usuario final tiene un array de permisos que viene del rol + permisos individuales
 */
import type { Permission, UserModuleAccess } from '../value-objects/permission';
import {
  ALL_PERMISSIONS,
  ADMIN_PERMISSIONS,
  GUEST_PERMISSIONS,
  DEFAULT_MODULE_ACCESS,
  FULL_MODULE_ACCESS
} from '../value-objects/permission';

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
  moduleAccess: UserModuleAccess; // Niveles de acceso por módulo
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
    permissions: ALL_PERMISSIONS,
    moduleAccess: FULL_MODULE_ACCESS,
    isSystem: true,
  },
  admin: {
    code: 'admin',
    name: 'Administrador',
    description: 'Gestión completa del sistema',
    permissions: ADMIN_PERMISSIONS,
    moduleAccess: FULL_MODULE_ACCESS,
    isSystem: true,
  },
  guest: {
    code: 'guest',
    name: 'Invitado',
    description: 'Solo lectura básica y reservas',
    permissions: GUEST_PERMISSIONS,
    moduleAccess: DEFAULT_MODULE_ACCESS, // Sin acceso por defecto
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
  'invitado': 'guest',

  // Payload CMS roles
  'author': 'admin',
  'autor': 'admin',
  'viewer': 'guest', // Visualizador: solo lectura
  'visualizador': 'guest',

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
  const normalizedName = backendRoleName.toLowerCase().trim();
  const roleCode = ROLE_NAME_MAPPING[normalizedName];

  if (roleCode) {
    return ROLES[roleCode];
  }

  // Default: guest para usuarios no reconocidos
  console.warn(`[Auth] Rol desconocido: "${backendRoleName}", asignando guest`);
  return ROLES.guest;
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
