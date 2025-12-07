/**
 * Permission - Sistema de permisos flexible
 * 
 * Formato: module.resource.operation:scope
 * - module: área del sistema (inventory, blog, users, settings)
 * - resource: recurso específico (items, posts, roles)
 * - operation: acción (read, create, update, delete, manage)
 * - scope: alcance (all, own, workspace)
 * 
 * Ejemplos:
 * - "inventory.items.read:all" - Leer todos los items
 * - "blog.posts.update:own" - Editar solo posts propios
 * - "*" - Permiso comodín (acceso total)
 */

// ============================================================
// TYPES
// ============================================================

export type Scope = 'all' | 'own' | 'workspace';
export type Operation = 'read' | 'create' | 'update' | 'delete' | 'manage';

/**
 * Permiso como string con formato module.resource.operation:scope
 * O "*" para acceso total
 */
export type Permission = string;

/**
 * Permiso parseado en sus componentes
 */
export interface ParsedPermission {
  module: string;
  resource: string;
  operation: Operation;
  scope: Scope;
  isWildcard: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

/** Permiso comodín - acceso total */
export const WILDCARD_PERMISSION = '*';

/** Permisos por módulo para admin */
export const ADMIN_PERMISSIONS: Permission[] = [
  // Users
  'users.users.read:all',
  'users.users.create:all',
  'users.users.update:all',
  'users.users.delete:all',
  'users.roles.read:all',
  'users.roles.manage:all',

  // Inventory
  'inventory.items.read:all',
  'inventory.items.create:all',
  'inventory.items.update:all',
  'inventory.items.delete:all',
  'inventory.stock.read:all',
  'inventory.stock.create:all',
  'inventory.stock.update:all',
  'inventory.stock.delete:all',
  'inventory.categories.read:all',
  'inventory.categories.create:all',
  'inventory.categories.update:all',
  'inventory.categories.delete:all',
  'inventory.locations.read:all',
  'inventory.locations.create:all',
  'inventory.locations.update:all',
  'inventory.locations.delete:all',

  // Blog
  'blog.posts.read:all',
  'blog.posts.create:all',
  'blog.posts.update:all',
  'blog.posts.delete:all',

  // Settings
  'settings.config.read:all',
  'settings.config.manage:all',
  'settings.reports.read:all',
  'settings.reports.export:all',

  // IoT
  'iot.devices.read:all',
  'iot.devices.create:all',
  'iot.devices.update:all',
  'iot.devices.delete:all',
  'iot.devices.manage:all',
];

/** Permisos para guest (solo lectura básica) */
export const GUEST_PERMISSIONS: Permission[] = [
  'blog.posts.read:all',
  'inventory.items.read:all',
  'inventory.categories.read:all',
];

/** Todos los permisos (para super_admin) */
export const ALL_PERMISSIONS: Permission[] = [WILDCARD_PERMISSION];

// ============================================================
// HELPERS
// ============================================================

/**
 * Parsear string de permiso a sus componentes
 */
export function parsePermission(permission: Permission): ParsedPermission | null {
  if (permission === WILDCARD_PERMISSION) {
    return {
      module: '*',
      resource: '*',
      operation: 'manage',
      scope: 'all',
      isWildcard: true,
    };
  }

  // Formato: module.resource.operation:scope
  const scopeMatch = permission.match(/^(.+):(\w+)$/);
  if (!scopeMatch) return null;

  const [, path, scopeStr] = scopeMatch;
  const parts = path.split('.');

  if (parts.length !== 3) return null;

  const [module, resource, operation] = parts;
  const scope = scopeStr as Scope;

  if (!['all', 'own', 'workspace'].includes(scope)) return null;
  if (!['read', 'create', 'update', 'delete', 'manage'].includes(operation)) return null;

  return {
    module,
    resource,
    operation: operation as Operation,
    scope,
    isWildcard: false,
  };
}

/**
 * Crear string de permiso desde componentes
 */
export function createPermission(
  module: string,
  resource: string,
  operation: Operation,
  scope: Scope = 'all'
): Permission {
  return `${module}.${resource}.${operation}:${scope}`;
}

/**
 * Verificar si un usuario tiene un permiso específico
 * 
 * @param userPermissions - Array de permisos del usuario
 * @param requiredPermission - Permiso requerido
 * @param requiredScope - Scope mínimo requerido (opcional)
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission,
  requiredScope?: Scope
): boolean {
  // Si tiene wildcard, tiene todo
  if (userPermissions.includes(WILDCARD_PERMISSION)) {
    return true;
  }

  // Parsear permiso requerido
  const required = parsePermission(requiredPermission);
  if (!required) return false;

  // Buscar coincidencia
  for (const userPerm of userPermissions) {
    const parsed = parsePermission(userPerm);
    if (!parsed) continue;

    // Wildcard match
    if (parsed.isWildcard) return true;

    // Exact match
    if (
      parsed.module === required.module &&
      parsed.resource === required.resource &&
      (parsed.operation === required.operation || parsed.operation === 'manage')
    ) {
      // Verificar scope si es requerido
      if (requiredScope) {
        return isScopeSufficient(parsed.scope, requiredScope);
      }
      return true;
    }
  }

  return false;
}

/**
 * Verificar si un scope es suficiente para otro
 * all > workspace > own
 */
function isScopeSufficient(userScope: Scope, requiredScope: Scope): boolean {
  const scopeHierarchy: Record<Scope, number> = {
    own: 1,
    workspace: 2,
    all: 3,
  };
  return scopeHierarchy[userScope] >= scopeHierarchy[requiredScope];
}

/**
 * Formatear permisos para display
 */
export function formatPermissionForDisplay(permission: Permission): string {
  if (permission === WILDCARD_PERMISSION) return 'Acceso Total';

  const parsed = parsePermission(permission);
  if (!parsed) return permission;

  return `${parsed.module}.${parsed.resource} - ${parsed.operation} (${parsed.scope})`;
}
