/**
 * Sistema de Permisos Granulares
 * 
 * Formato: recurso:acción
 * Ejemplos: users:create, posts:edit, inventory:view
 */

// ==================== PERMISOS ====================

export const PERMISSIONS = {
  // Usuarios
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE_ROLES: 'users:manage-roles',
  
  // Blog
  POSTS_VIEW: 'posts:view',
  POSTS_CREATE: 'posts:create',
  POSTS_EDIT: 'posts:edit',
  POSTS_DELETE: 'posts:delete',
  POSTS_PUBLISH: 'posts:publish',
  
  // Inventario
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_EDIT: 'inventory:edit',
  INVENTORY_DELETE: 'inventory:delete',
  
  // IoT
  IOT_VIEW: 'iot:view',
  IOT_CONTROL: 'iot:control',
  IOT_CONFIGURE: 'iot:configure',
  
  // Admin
  ADMIN_ACCESS: 'admin:access',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_FULL: 'admin:full',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ==================== ROLES ====================

export interface RoleDefinition {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
  esEditable: boolean;  // Roles del sistema no editables
}

export const ROLES: Record<string, RoleDefinition> = {
  super_admin: {
    id: 'super_admin',
    nombre: 'Super Administrador',
    descripcion: 'Acceso completo a todo el sistema',
    permisos: Object.values(PERMISSIONS),
    esEditable: false,
  },
  admin: {
    id: 'admin',
    nombre: 'Administrador',
    descripcion: 'Gestión de usuarios, contenido e inventario',
    permisos: [
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.ADMIN_SETTINGS,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.POSTS_VIEW,
      PERMISSIONS.POSTS_CREATE,
      PERMISSIONS.POSTS_EDIT,
      PERMISSIONS.POSTS_DELETE,
      PERMISSIONS.POSTS_PUBLISH,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_CREATE,
      PERMISSIONS.INVENTORY_EDIT,
      PERMISSIONS.INVENTORY_DELETE,
      PERMISSIONS.IOT_VIEW,
      PERMISSIONS.IOT_CONTROL,
    ],
    esEditable: false,
  },
  editor: {
    id: 'editor',
    nombre: 'Editor',
    descripcion: 'Gestión de contenido del blog',
    permisos: [
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.POSTS_VIEW,
      PERMISSIONS.POSTS_CREATE,
      PERMISSIONS.POSTS_EDIT,
      PERMISSIONS.POSTS_PUBLISH,
    ],
    esEditable: true,
  },
  inventory_manager: {
    id: 'inventory_manager',
    nombre: 'Gestor de Inventario',
    descripcion: 'Gestión del inventario del FabLab',
    permisos: [
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_CREATE,
      PERMISSIONS.INVENTORY_EDIT,
      PERMISSIONS.INVENTORY_DELETE,
    ],
    esEditable: true,
  },
  iot_operator: {
    id: 'iot_operator',
    nombre: 'Operador IoT',
    descripcion: 'Control de dispositivos IoT',
    permisos: [
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.IOT_VIEW,
      PERMISSIONS.IOT_CONTROL,
    ],
    esEditable: true,
  },
  viewer: {
    id: 'viewer',
    nombre: 'Visualizador',
    descripcion: 'Solo lectura en el panel admin',
    permisos: [
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.POSTS_VIEW,
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.IOT_VIEW,
    ],
    esEditable: true,
  },
  authenticated: {
    id: 'authenticated',
    nombre: 'Usuario Autenticado',
    descripcion: 'Usuario registrado sin acceso admin',
    permisos: [],
    esEditable: false,
  },
};

// ==================== HELPERS ====================

/**
 * Verifica si un conjunto de permisos incluye un permiso específico
 */
export function hasPermission(userPermissions: Permission[], permission: Permission): boolean {
  // Super admin tiene todo
  if (userPermissions.includes(PERMISSIONS.ADMIN_FULL)) return true;
  return userPermissions.includes(permission);
}

/**
 * Verifica si tiene alguno de los permisos
 */
export function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean {
  if (userPermissions.includes(PERMISSIONS.ADMIN_FULL)) return true;
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * Verifica si tiene todos los permisos
 */
export function hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean {
  if (userPermissions.includes(PERMISSIONS.ADMIN_FULL)) return true;
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * Obtiene los permisos de un rol
 */
export function getPermissionsForRole(roleId: string): Permission[] {
  return ROLES[roleId]?.permisos || [];
}

/**
 * Obtiene los permisos combinados de múltiples roles
 */
export function getPermissionsForRoles(roleIds: string[]): Permission[] {
  const allPerms = roleIds.flatMap(id => getPermissionsForRole(id));
  return [...new Set(allPerms)]; // Eliminar duplicados
}

/**
 * Agrupa permisos por recurso para mostrar en UI
 */
export function groupPermissionsByResource(): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {};
  
  Object.values(PERMISSIONS).forEach(perm => {
    const [resource] = perm.split(':');
    if (!groups[resource]) groups[resource] = [];
    groups[resource].push(perm);
  });
  
  return groups;
}

/**
 * Traduce un permiso a español para UI
 */
export function translatePermission(permission: Permission): string {
  const translations: Record<Permission, string> = {
    [PERMISSIONS.USERS_VIEW]: 'Ver usuarios',
    [PERMISSIONS.USERS_CREATE]: 'Crear usuarios',
    [PERMISSIONS.USERS_EDIT]: 'Editar usuarios',
    [PERMISSIONS.USERS_DELETE]: 'Eliminar usuarios',
    [PERMISSIONS.USERS_MANAGE_ROLES]: 'Gestionar roles',
    [PERMISSIONS.POSTS_VIEW]: 'Ver posts',
    [PERMISSIONS.POSTS_CREATE]: 'Crear posts',
    [PERMISSIONS.POSTS_EDIT]: 'Editar posts',
    [PERMISSIONS.POSTS_DELETE]: 'Eliminar posts',
    [PERMISSIONS.POSTS_PUBLISH]: 'Publicar posts',
    [PERMISSIONS.INVENTORY_VIEW]: 'Ver inventario',
    [PERMISSIONS.INVENTORY_CREATE]: 'Crear items',
    [PERMISSIONS.INVENTORY_EDIT]: 'Editar items',
    [PERMISSIONS.INVENTORY_DELETE]: 'Eliminar items',
    [PERMISSIONS.IOT_VIEW]: 'Ver dispositivos IoT',
    [PERMISSIONS.IOT_CONTROL]: 'Controlar dispositivos',
    [PERMISSIONS.IOT_CONFIGURE]: 'Configurar IoT',
    [PERMISSIONS.ADMIN_ACCESS]: 'Acceso al panel',
    [PERMISSIONS.ADMIN_SETTINGS]: 'Configuración',
    [PERMISSIONS.ADMIN_FULL]: 'Acceso completo',
  };
  return translations[permission] || permission;
}

/**
 * Traduce nombre de recurso
 */
export function translateResource(resource: string): string {
  const translations: Record<string, string> = {
    users: 'Usuarios',
    posts: 'Blog',
    inventory: 'Inventario',
    iot: 'IoT',
    admin: 'Administración',
  };
  return translations[resource] || resource;
}
