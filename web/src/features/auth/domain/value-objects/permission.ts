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

/** Permisos para guest (solo reservas) */
export const GUEST_PERMISSIONS: Permission[] = [
  'reservations.requests.create:own', // Puede solicitar reservas
  'reservations.requests.read:own',   // Puede ver sus propias reservas
];

// ============================================================
// FEATURE MODULES WITH ACCESS LEVELS
// ============================================================

/** Módulos de funcionalidad del sistema */
export type FeatureModule = 'inventory' | 'cms' | 'blog' | 'users' | 'settings';

/** Nivel de acceso genérico */
export type AccessLevel = 'none' | 'view' | 'edit_own' | 'edit_all' | 'reserve' | 'manage';

/** Opción de nivel de acceso para UI */
export interface AccessLevelOption {
  value: AccessLevel;
  label: string;
  description?: string;
}

/** Definición de cada módulo con niveles de acceso */
export interface FeatureModuleDefinition {
  name: string;
  description: string;
  icon: string;
  accessLevels: AccessLevelOption[];
  defaultLevel: AccessLevel;
}

/** 
 * Módulos con niveles de acceso personalizados
 */
export const FEATURE_MODULES: Record<FeatureModule, FeatureModuleDefinition> = {
  inventory: {
    name: 'Inventario',
    description: 'Items, stock y ubicaciones',
    icon: 'Package',
    accessLevels: [
      { value: 'none', label: 'Sin acceso' },
      { value: 'view', label: 'Solo ver', description: 'Ver items y stock' },
      { value: 'reserve', label: 'Reservar', description: 'Ver + hacer reservas' },
      { value: 'manage', label: 'Administrar', description: 'Control total' },
    ],
    defaultLevel: 'none',
  },
  cms: {
    name: 'Gestión Web',
    description: 'Contenido del sitio',
    icon: 'Globe',
    accessLevels: [
      { value: 'none', label: 'Sin acceso' },
      { value: 'view', label: 'Solo ver' },
      { value: 'edit_all', label: 'Editar', description: 'Crear y modificar contenido' },
    ],
    defaultLevel: 'none',
  },
  blog: {
    name: 'Blog',
    description: 'Posts y categorías',
    icon: 'FileText',
    accessLevels: [
      { value: 'none', label: 'Sin acceso' },
      { value: 'view', label: 'Solo ver' },
      { value: 'edit_own', label: 'Editar propios', description: 'Solo tus posts' },
      { value: 'edit_all', label: 'Editar todos', description: 'Cualquier post' },
    ],
    defaultLevel: 'none',
  },
  users: {
    name: 'Usuarios',
    description: 'Gestión de usuarios',
    icon: 'Users',
    accessLevels: [
      { value: 'none', label: 'Sin acceso' },
      { value: 'view', label: 'Solo ver' },
      { value: 'manage', label: 'Administrar', description: 'Crear/editar usuarios' },
    ],
    defaultLevel: 'none',
  },
  settings: {
    name: 'Configuración',
    description: 'Config del sistema',
    icon: 'Settings',
    accessLevels: [
      { value: 'none', label: 'Sin acceso' },
      { value: 'view', label: 'Solo ver' },
      { value: 'manage', label: 'Administrar' },
    ],
    defaultLevel: 'none',
  },
};

/** Acceso de un usuario a los módulos */
export type UserModuleAccess = Record<FeatureModule, AccessLevel>;

/** Acceso por defecto para invitados */
export const DEFAULT_MODULE_ACCESS: UserModuleAccess = {
  inventory: 'none',
  cms: 'none',
  blog: 'none',
  users: 'none',
  settings: 'none',
};

/** Acceso completo para admins */
export const FULL_MODULE_ACCESS: UserModuleAccess = {
  inventory: 'manage',
  cms: 'edit_all',
  blog: 'edit_all',
  users: 'manage',
  settings: 'manage',
};

/**
 * Verificar si un usuario tiene al menos un nivel de acceso a un módulo
 */
export function hasModuleAccess(userAccess: UserModuleAccess, module: FeatureModule, minLevel: AccessLevel = 'view'): boolean {
  const userLevel = userAccess[module];
  if (userLevel === 'none') return false;
  if (minLevel === 'none' || minLevel === 'view') return true; // Ya tiene acceso (no es 'none')
  if (minLevel === 'manage') return userLevel === 'manage';
  // Para reserve, edit_own, edit_all - el usuario tiene acceso si su nivel no es 'none' o 'view'
  return userLevel !== 'view';
}

/**
 * Verificar si puede editar (propio o todos)
 */
export function canEdit(userAccess: UserModuleAccess, module: FeatureModule): boolean {
  const level = userAccess[module];
  return level === 'edit_own' || level === 'edit_all' || level === 'manage';
}

/**
 * Verificar si puede editar todos (no solo propios)
 */
export function canEditAll(userAccess: UserModuleAccess, module: FeatureModule): boolean {
  const level = userAccess[module];
  return level === 'edit_all' || level === 'manage';
}

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
