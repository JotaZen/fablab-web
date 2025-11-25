/**
 * ============================================================
 * DOMAIN - PERFILES PREDEFINIDOS (ROLES)
 * ============================================================
 * 
 * Plantillas de permisos para facilitar la asignación
 */

import type { Profile, PermissionScope } from './entities';
import { PERMISSIONS } from './permissions.constants';

// ============================================================
// PERFILES DEL SISTEMA
// ============================================================

export const PROFILES: Record<string, Profile> = {
  // ==================== SUPER ADMIN ====================
  superadmin: {
    id: 'superadmin',
    name: 'Super Administrador',
    description: 'Acceso completo a todo el sistema',
    permissionIds: Object.values(PERMISSIONS),
    defaultScope: 'global',
    isSystem: true,
  },

  // ==================== ADMIN ====================
  admin: {
    id: 'admin',
    name: 'Administrador',
    description: 'Gestión general del FabLab',
    permissionIds: [
      // Admin
      PERMISSIONS.ADMIN_DASHBOARD_ACCESS,
      PERMISSIONS.ADMIN_SETTINGS_READ,
      // Inventario
      PERMISSIONS.INVENTORY_ITEMS_READ,
      PERMISSIONS.INVENTORY_ITEMS_CREATE,
      PERMISSIONS.INVENTORY_ITEMS_UPDATE,
      PERMISSIONS.INVENTORY_CATEGORIES_MANAGE,
      PERMISSIONS.INVENTORY_LOANS_READ,
      PERMISSIONS.INVENTORY_LOANS_MANAGE,
      // IoT
      PERMISSIONS.IOT_DEVICES_READ,
      PERMISSIONS.IOT_DEVICES_CONTROL,
      // Blog
      PERMISSIONS.BLOG_POSTS_READ,
      PERMISSIONS.BLOG_POSTS_CREATE,
      PERMISSIONS.BLOG_POSTS_UPDATE,
      PERMISSIONS.BLOG_POSTS_DELETE,
      PERMISSIONS.BLOG_POSTS_PUBLISH,
      // Usuarios
      PERMISSIONS.USERS_LIST_READ,
      PERMISSIONS.USERS_PROFILE_READ,
      PERMISSIONS.USERS_PROFILE_UPDATE,
      PERMISSIONS.USERS_ACCOUNTS_CREATE,
      // Reservaciones
      PERMISSIONS.RESERVATIONS_ALL_READ,
      PERMISSIONS.RESERVATIONS_ALL_MANAGE,
    ],
    defaultScope: 'global',
    isSystem: true,
  },

  // ==================== EDITOR ====================
  editor: {
    id: 'editor',
    name: 'Editor',
    description: 'Gestión de contenido del blog',
    permissionIds: [
      PERMISSIONS.ADMIN_DASHBOARD_ACCESS,
      PERMISSIONS.BLOG_POSTS_READ,
      PERMISSIONS.BLOG_POSTS_CREATE,
      PERMISSIONS.BLOG_POSTS_UPDATE,
      PERMISSIONS.BLOG_POSTS_PUBLISH,
    ],
    defaultScope: 'own',
    isSystem: true,
  },

  // ==================== INVENTORY MANAGER ====================
  inventory_manager: {
    id: 'inventory_manager',
    name: 'Encargado de Inventario',
    description: 'Gestión completa del inventario',
    permissionIds: [
      PERMISSIONS.ADMIN_DASHBOARD_ACCESS,
      PERMISSIONS.INVENTORY_ITEMS_READ,
      PERMISSIONS.INVENTORY_ITEMS_CREATE,
      PERMISSIONS.INVENTORY_ITEMS_UPDATE,
      PERMISSIONS.INVENTORY_ITEMS_DELETE,
      PERMISSIONS.INVENTORY_CATEGORIES_MANAGE,
      PERMISSIONS.INVENTORY_LOANS_READ,
      PERMISSIONS.INVENTORY_LOANS_MANAGE,
    ],
    defaultScope: 'global',
    isSystem: true,
  },

  // ==================== IOT OPERATOR ====================
  iot_operator: {
    id: 'iot_operator',
    name: 'Operador IoT',
    description: 'Control de dispositivos IoT',
    permissionIds: [
      PERMISSIONS.ADMIN_DASHBOARD_ACCESS,
      PERMISSIONS.IOT_DEVICES_READ,
      PERMISSIONS.IOT_DEVICES_CONTROL,
      PERMISSIONS.IOT_LOGS_READ,
    ],
    defaultScope: 'global',
    isSystem: true,
  },

  // ==================== MEMBER ====================
  member: {
    id: 'member',
    name: 'Miembro FabLab',
    description: 'Usuario regular del FabLab',
    permissionIds: [
      PERMISSIONS.INVENTORY_ITEMS_READ,
      PERMISSIONS.INVENTORY_LOANS_READ,
      PERMISSIONS.BLOG_POSTS_READ,
      PERMISSIONS.RESERVATIONS_OWN_READ,
      PERMISSIONS.RESERVATIONS_OWN_CREATE,
      PERMISSIONS.RESERVATIONS_OWN_CANCEL,
    ],
    defaultScope: 'own',
    isSystem: true,
  },

  // ==================== VISITOR ====================
  visitor: {
    id: 'visitor',
    name: 'Visitante',
    description: 'Acceso de solo lectura',
    permissionIds: [
      PERMISSIONS.INVENTORY_ITEMS_READ,
      PERMISSIONS.BLOG_POSTS_READ,
    ],
    defaultScope: 'global',
    isSystem: false,
  },
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Obtiene un perfil por su ID
 */
export function getProfileById(id: string): Profile | undefined {
  return PROFILES[id];
}

/**
 * Obtiene todos los perfiles disponibles
 */
export function getAllProfiles(): Profile[] {
  return Object.values(PROFILES);
}

/**
 * Obtiene perfiles del sistema (no editables)
 */
export function getSystemProfiles(): Profile[] {
  return Object.values(PROFILES).filter(p => p.isSystem);
}

/**
 * Obtiene los IDs de permisos de un perfil
 */
export function getPermissionIdsForProfile(profileId: string): string[] {
  const profile = PROFILES[profileId];
  return profile?.permissionIds || [];
}

/**
 * Obtiene los IDs de permisos de múltiples perfiles (sin duplicados)
 */
export function getPermissionIdsForProfiles(profileIds: string[]): string[] {
  const permissionSet = new Set<string>();
  
  for (const profileId of profileIds) {
    const permissions = getPermissionIdsForProfile(profileId);
    permissions.forEach(p => permissionSet.add(p));
  }
  
  return Array.from(permissionSet);
}

/**
 * Resuelve permisos de perfiles a ResolvedPermission[]
 */
export function resolveProfilePermissions(
  profileIds: string[]
): Array<{ id: string; scope: PermissionScope }> {
  const result: Array<{ id: string; scope: PermissionScope }> = [];
  const seen = new Set<string>();

  for (const profileId of profileIds) {
    const profile = PROFILES[profileId];
    if (!profile) continue;

    for (const permissionId of profile.permissionIds) {
      if (!seen.has(permissionId)) {
        seen.add(permissionId);
        result.push({
          id: permissionId,
          scope: profile.defaultScope,
        });
      }
    }
  }

  return result;
}
