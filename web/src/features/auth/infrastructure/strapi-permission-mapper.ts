/**
 * ============================================================
 * INFRASTRUCTURE - STRAPI PERMISSION MAPPER
 * ============================================================
 * 
 * Mapea permisos de Strapi Users & Permissions plugin
 * a nuestro sistema interno de permisos
 */

import type { ExternalPermissionMapper, ResolvedPermission, PermissionScope } from '../domain';
import { PERMISSIONS, getPermissionById } from '../domain';

// ============================================================
// TIPOS DE STRAPI
// ============================================================

interface StrapiRole {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface StrapiPermission {
  id: number;
  action: string;
  subject: string | null;
  properties: Record<string, unknown>;
  conditions: unknown[];
  role: StrapiRole;
}

// ============================================================
// MAPEO DE PERMISOS
// ============================================================

/**
 * Mapeo de acciones de Strapi a permisos internos
 * 
 * Strapi usa formato: "api::content-type.controller.action"
 * Nosotros usamos: "categoria.recurso.accion"
 */
const STRAPI_TO_INTERNAL_MAP: Record<string, string> = {
  // Inventory (si existiera en Strapi)
  'api::inventory.inventory.find': PERMISSIONS.INVENTORY_ITEMS_READ,
  'api::inventory.inventory.findOne': PERMISSIONS.INVENTORY_ITEMS_READ,
  'api::inventory.inventory.create': PERMISSIONS.INVENTORY_ITEMS_CREATE,
  'api::inventory.inventory.update': PERMISSIONS.INVENTORY_ITEMS_UPDATE,
  'api::inventory.inventory.delete': PERMISSIONS.INVENTORY_ITEMS_DELETE,

  // Posts/Blog
  'api::post.post.find': PERMISSIONS.BLOG_POSTS_READ,
  'api::post.post.findOne': PERMISSIONS.BLOG_POSTS_READ,
  'api::post.post.create': PERMISSIONS.BLOG_POSTS_CREATE,
  'api::post.post.update': PERMISSIONS.BLOG_POSTS_UPDATE,
  'api::post.post.delete': PERMISSIONS.BLOG_POSTS_DELETE,

  // Users
  'plugin::users-permissions.user.find': PERMISSIONS.USERS_LIST_READ,
  'plugin::users-permissions.user.findOne': PERMISSIONS.USERS_PROFILE_READ,
  'plugin::users-permissions.user.create': PERMISSIONS.USERS_ACCOUNTS_CREATE,
  'plugin::users-permissions.user.update': PERMISSIONS.USERS_PROFILE_UPDATE,
  'plugin::users-permissions.user.destroy': PERMISSIONS.USERS_ACCOUNTS_DELETE,
  'plugin::users-permissions.user.me': PERMISSIONS.USERS_PROFILE_READ,

  // Permission (nuestro custom type)
  'api::permission.permission.find': PERMISSIONS.ADMIN_SETTINGS_READ,
  'api::permission.permission.findOne': PERMISSIONS.ADMIN_SETTINGS_READ,
  'api::user-permission.user-permission.find': PERMISSIONS.USERS_PERMISSIONS_MANAGE,
  'api::user-permission.user-permission.create': PERMISSIONS.USERS_PERMISSIONS_MANAGE,
  'api::user-permission.user-permission.update': PERMISSIONS.USERS_PERMISSIONS_MANAGE,
  'api::user-permission.user-permission.delete': PERMISSIONS.USERS_PERMISSIONS_MANAGE,
};

/**
 * Mapeo de roles de Strapi a perfiles internos
 */
const STRAPI_ROLE_TO_PROFILE: Record<string, string> = {
  'Super Admin': 'superadmin',
  'Editor': 'editor',
  'Author': 'editor',
  'Authenticated': 'member',
  'Public': 'visitor',
};

// ============================================================
// STRAPI PERMISSION MAPPER
// ============================================================

export class StrapiPermissionMapper implements ExternalPermissionMapper {
  readonly systemName = 'strapi';

  /**
   * Mapea permisos de Strapi al sistema interno
   */
  mapToInternal(externalPermissions: unknown): ResolvedPermission[] {
    if (!Array.isArray(externalPermissions)) {
      return [];
    }

    const internalPermissions: ResolvedPermission[] = [];
    const seen = new Set<string>();

    for (const strapiPerm of externalPermissions as StrapiPermission[]) {
      const internalId = STRAPI_TO_INTERNAL_MAP[strapiPerm.action];
      
      if (internalId && !seen.has(internalId)) {
        seen.add(internalId);
        internalPermissions.push({
          id: internalId,
          scope: this.determineScope(strapiPerm),
        });
      }
    }

    return internalPermissions;
  }

  /**
   * Mapea permisos internos a formato Strapi
   * (Para crear permisos en Strapi desde nuestro sistema)
   */
  mapToExternal(internalPermissions: ResolvedPermission[]): string[] {
    const externalActions: string[] = [];

    for (const [strapiAction, internalId] of Object.entries(STRAPI_TO_INTERNAL_MAP)) {
      if (internalPermissions.some(p => p.id === internalId)) {
        externalActions.push(strapiAction);
      }
    }

    return externalActions;
  }

  /**
   * Verifica si existe mapeo para un permiso externo
   */
  hasMapping(externalPermission: string): boolean {
    return externalPermission in STRAPI_TO_INTERNAL_MAP;
  }

  /**
   * Mapea un rol de Strapi a un perfil interno
   */
  mapRoleToProfile(strapiRole: StrapiRole | string): string {
    const roleName = typeof strapiRole === 'string' ? strapiRole : strapiRole.name;
    return STRAPI_ROLE_TO_PROFILE[roleName] || 'member';
  }

  /**
   * Determina el scope basado en las condiciones del permiso
   */
  private determineScope(strapiPerm: StrapiPermission): PermissionScope {
    // Si tiene condiciones que limitan a "own", el scope es "own"
    if (strapiPerm.conditions && strapiPerm.conditions.length > 0) {
      const conditionsStr = JSON.stringify(strapiPerm.conditions);
      if (conditionsStr.includes('isOwner') || conditionsStr.includes('createdBy')) {
        return 'own';
      }
    }
    
    // Por defecto es global
    return 'global';
  }
}

// ============================================================
// FACTORY
// ============================================================

let mapperInstance: StrapiPermissionMapper | null = null;

export function getStrapiPermissionMapper(): ExternalPermissionMapper {
  if (!mapperInstance) {
    mapperInstance = new StrapiPermissionMapper();
  }
  return mapperInstance;
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Obtiene los permisos internos desde el rol de Strapi de un usuario
 */
export function getPermissionsFromStrapiRole(
  roleName: string
): ResolvedPermission[] {
  const mapper = getStrapiPermissionMapper() as StrapiPermissionMapper;
  const profileId = mapper.mapRoleToProfile(roleName);
  
  // Importar dinámicamente para evitar dependencia circular
  const { resolveProfilePermissions } = require('../domain');
  return resolveProfilePermissions([profileId]);
}
