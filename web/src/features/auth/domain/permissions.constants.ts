/**
 * ============================================================
 * DOMAIN - CONSTANTES DE PERMISOS
 * ============================================================
 * 
 * Definición de todos los permisos del sistema FabLab
 * Formato: "categoria.recurso.accion"
 */

import type { Permission, PermissionCategory } from './entities';

// ============================================================
// DEFINICIÓN DE PERMISOS POR CATEGORÍA
// ============================================================

/**
 * Todos los permisos del sistema
 * El ID sigue el formato: categoria.recurso.accion
 */
export const PERMISSIONS = {
  // ==================== SISTEMA (GLOBAL) ====================
  /** Permiso wildcard: acceso total a todo el sistema */
  SYSTEM_ALL: 'system.all.all',

  // ==================== INVENTARIO ====================
  INVENTORY_ITEMS_READ: 'inventory.items.read',
  INVENTORY_ITEMS_CREATE: 'inventory.items.create',
  INVENTORY_ITEMS_UPDATE: 'inventory.items.update',
  INVENTORY_ITEMS_DELETE: 'inventory.items.delete',
  INVENTORY_CATEGORIES_MANAGE: 'inventory.categories.manage',
  INVENTORY_LOANS_READ: 'inventory.loans.read',
  INVENTORY_LOANS_MANAGE: 'inventory.loans.manage',

  // ==================== IOT ====================
  IOT_DEVICES_READ: 'iot.devices.read',
  IOT_DEVICES_CONTROL: 'iot.devices.control',
  IOT_DEVICES_CONFIGURE: 'iot.devices.configure',
  IOT_LOGS_READ: 'iot.logs.read',

  // ==================== BLOG ====================
  BLOG_POSTS_READ: 'blog.posts.read',
  BLOG_POSTS_CREATE: 'blog.posts.create',
  BLOG_POSTS_UPDATE: 'blog.posts.update',
  BLOG_POSTS_DELETE: 'blog.posts.delete',
  BLOG_POSTS_PUBLISH: 'blog.posts.publish',

  // ==================== USUARIOS ====================
  USERS_LIST_READ: 'users.list.read',
  USERS_PROFILE_READ: 'users.profile.read',
  USERS_PROFILE_UPDATE: 'users.profile.update',
  USERS_ACCOUNTS_CREATE: 'users.accounts.create',
  USERS_ACCOUNTS_DELETE: 'users.accounts.delete',
  USERS_PERMISSIONS_MANAGE: 'users.permissions.manage',

  // ==================== ADMIN ====================
  ADMIN_DASHBOARD_ACCESS: 'admin.dashboard.access',
  ADMIN_SETTINGS_READ: 'admin.settings.read',
  ADMIN_SETTINGS_UPDATE: 'admin.settings.update',
  ADMIN_AUDIT_READ: 'admin.audit.read',

  // ==================== RESERVACIONES ====================
  RESERVATIONS_OWN_READ: 'reservations.own.read',
  RESERVATIONS_OWN_CREATE: 'reservations.own.create',
  RESERVATIONS_OWN_CANCEL: 'reservations.own.cancel',
  RESERVATIONS_ALL_READ: 'reservations.all.read',
  RESERVATIONS_ALL_MANAGE: 'reservations.all.manage',
} as const;

export type PermissionId = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ============================================================
// METADATA DE PERMISOS
// ============================================================

/**
 * Información completa de cada permiso
 * Usado para UI, seeds, y documentación
 */
export const PERMISSION_DEFINITIONS: Permission[] = [
  // Inventario
  { id: PERMISSIONS.INVENTORY_ITEMS_READ, description: 'Ver items del inventario', category: 'inventory', isActive: true },
  { id: PERMISSIONS.INVENTORY_ITEMS_CREATE, description: 'Crear items en el inventario', category: 'inventory', isActive: true },
  { id: PERMISSIONS.INVENTORY_ITEMS_UPDATE, description: 'Editar items del inventario', category: 'inventory', isActive: true },
  { id: PERMISSIONS.INVENTORY_ITEMS_DELETE, description: 'Eliminar items del inventario', category: 'inventory', isActive: true },
  { id: PERMISSIONS.INVENTORY_CATEGORIES_MANAGE, description: 'Gestionar categorías del inventario', category: 'inventory', isActive: true },
  { id: PERMISSIONS.INVENTORY_LOANS_READ, description: 'Ver préstamos de equipos', category: 'inventory', isActive: true },
  { id: PERMISSIONS.INVENTORY_LOANS_MANAGE, description: 'Gestionar préstamos de equipos', category: 'inventory', isActive: true },
  
  // IoT
  { id: PERMISSIONS.IOT_DEVICES_READ, description: 'Ver estado de dispositivos IoT', category: 'iot', isActive: true },
  { id: PERMISSIONS.IOT_DEVICES_CONTROL, description: 'Controlar dispositivos IoT', category: 'iot', isActive: true },
  { id: PERMISSIONS.IOT_DEVICES_CONFIGURE, description: 'Configurar dispositivos IoT', category: 'iot', isActive: true },
  { id: PERMISSIONS.IOT_LOGS_READ, description: 'Ver logs de dispositivos IoT', category: 'iot', isActive: true },
  
  // Blog
  { id: PERMISSIONS.BLOG_POSTS_READ, description: 'Ver posts del blog', category: 'blog', isActive: true },
  { id: PERMISSIONS.BLOG_POSTS_CREATE, description: 'Crear posts en el blog', category: 'blog', isActive: true },
  { id: PERMISSIONS.BLOG_POSTS_UPDATE, description: 'Editar posts del blog', category: 'blog', isActive: true },
  { id: PERMISSIONS.BLOG_POSTS_DELETE, description: 'Eliminar posts del blog', category: 'blog', isActive: true },
  { id: PERMISSIONS.BLOG_POSTS_PUBLISH, description: 'Publicar/despublicar posts', category: 'blog', isActive: true },
  
  // Usuarios
  { id: PERMISSIONS.USERS_LIST_READ, description: 'Ver lista de usuarios', category: 'users', isActive: true },
  { id: PERMISSIONS.USERS_PROFILE_READ, description: 'Ver perfiles de usuarios', category: 'users', isActive: true },
  { id: PERMISSIONS.USERS_PROFILE_UPDATE, description: 'Editar perfiles de usuarios', category: 'users', isActive: true },
  { id: PERMISSIONS.USERS_ACCOUNTS_CREATE, description: 'Crear cuentas de usuario', category: 'users', isActive: true },
  { id: PERMISSIONS.USERS_ACCOUNTS_DELETE, description: 'Eliminar cuentas de usuario', category: 'users', isActive: true },
  { id: PERMISSIONS.USERS_PERMISSIONS_MANAGE, description: 'Gestionar permisos de usuarios', category: 'users', isActive: true },
  
  // Admin
  { id: PERMISSIONS.ADMIN_DASHBOARD_ACCESS, description: 'Acceder al panel de administración', category: 'admin', isActive: true },
  { id: PERMISSIONS.ADMIN_SETTINGS_READ, description: 'Ver configuración del sistema', category: 'admin', isActive: true },
  { id: PERMISSIONS.ADMIN_SETTINGS_UPDATE, description: 'Modificar configuración del sistema', category: 'admin', isActive: true },
  { id: PERMISSIONS.ADMIN_AUDIT_READ, description: 'Ver logs de auditoría', category: 'admin', isActive: true },
  
  // Reservaciones
  { id: PERMISSIONS.RESERVATIONS_OWN_READ, description: 'Ver mis reservaciones', category: 'reservations', isActive: true },
  { id: PERMISSIONS.RESERVATIONS_OWN_CREATE, description: 'Crear mis reservaciones', category: 'reservations', isActive: true },
  { id: PERMISSIONS.RESERVATIONS_OWN_CANCEL, description: 'Cancelar mis reservaciones', category: 'reservations', isActive: true },
  { id: PERMISSIONS.RESERVATIONS_ALL_READ, description: 'Ver todas las reservaciones', category: 'reservations', isActive: true },
  { id: PERMISSIONS.RESERVATIONS_ALL_MANAGE, description: 'Gestionar todas las reservaciones', category: 'reservations', isActive: true },
];

// ============================================================
// CATEGORÍAS
// ============================================================

export const PERMISSION_CATEGORIES: Record<PermissionCategory, { name: string; description: string }> = {
  inventory: { name: 'Inventario', description: 'Gestión de equipos y materiales' },
  iot: { name: 'IoT', description: 'Control de dispositivos conectados' },
  blog: { name: 'Blog', description: 'Publicación de contenido' },
  users: { name: 'Usuarios', description: 'Gestión de cuentas' },
  admin: { name: 'Administración', description: 'Configuración del sistema' },
  reservations: { name: 'Reservaciones', description: 'Gestión de reservas' },
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Obtiene la categoría de un permiso desde su ID
 */
export function getCategoryFromPermissionId(permissionId: string): PermissionCategory | null {
  const parts = permissionId.split('.');
  if (parts.length < 3) return null;
  const category = parts[0] as PermissionCategory;
  return PERMISSION_CATEGORIES[category] ? category : null;
}

/**
 * Obtiene todos los permisos de una categoría
 */
export function getPermissionsByCategory(category: PermissionCategory): Permission[] {
  return PERMISSION_DEFINITIONS.filter(p => p.category === category);
}

/**
 * Busca un permiso por su ID
 */
export function getPermissionById(id: string): Permission | undefined {
  return PERMISSION_DEFINITIONS.find(p => p.id === id);
}

/**
 * Traduce un ID de permiso a texto legible
 */
export function translatePermissionId(id: string): string {
  const permission = getPermissionById(id);
  return permission?.description || id;
}

/**
 * Agrupa permisos por categoría
 */
export function groupPermissionsByCategory(): Record<PermissionCategory, Permission[]> {
  return PERMISSION_DEFINITIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<PermissionCategory, Permission[]>);
}
