/**
 * Role - Entidad de rol con permisos
 */
import type { Permission } from '../value-objects/permission';
import { ALL_PERMISSIONS } from '../value-objects/permission';

export type RoleId = 'super_admin' | 'admin' | 'coordinator' | 'operator' | 'visitor' | 'public';

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
}

export const ROLES: Record<RoleId, Role> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Administrador',
    description: 'Acceso total al sistema',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
  },
  admin: {
    id: 'admin',
    name: 'Administrador',
    description: 'Gestión completa excepto configuración crítica',
    permissions: [
      'users.read', 'users.create', 'users.update', 'users.delete',
      'roles.read',
      'inventory.read', 'inventory.manage', 'inventory.export', 'inventory.import',
      'items.manage', 'stock.manage',
      'categories.create', 'categories.read', 'categories.update', 'categories.delete',
      'locations.create', 'locations.read', 'locations.update', 'locations.delete',
      'iot.manage', 'devices.manage',
      'blog.manage',
      'posts.create', 'posts.read', 'posts.update', 'posts.delete',
      'settings.read',
      'reports.read', 'reports.export',
    ],
    isSystem: true,
  },
  coordinator: {
    id: 'coordinator',
    name: 'Coordinador',
    description: 'Gestión de inventario y supervisión',
    permissions: [
      'users.read',
      'inventory.read', 'inventory.export',
      'items.create', 'items.read', 'items.update',
      'stock.create', 'stock.read', 'stock.update',
      'categories.read', 'locations.read',
      'iot.read', 'devices.read',
      'blog.read',
      'posts.create', 'posts.read', 'posts.update',
      'reports.read', 'reports.export',
    ],
    isSystem: false,
  },
  operator: {
    id: 'operator',
    name: 'Operador',
    description: 'Operaciones diarias de inventario',
    permissions: [
      'inventory.read',
      'items.read',
      'stock.create', 'stock.read', 'stock.update',
      'categories.read', 'locations.read',
      'iot.read', 'devices.read',
      'blog.read', 'posts.read',
    ],
    isSystem: false,
  },
  visitor: {
    id: 'visitor',
    name: 'Visitante',
    description: 'Solo lectura',
    permissions: [
      'inventory.read', 'items.read', 'stock.read',
      'categories.read', 'locations.read',
      'blog.read', 'posts.read',
    ],
    isSystem: false,
  },
  public: {
    id: 'public',
    name: 'Público',
    description: 'Sin autenticación',
    permissions: ['blog.read', 'posts.read'],
    isSystem: true,
  },
};

export function getRole(idOrName: string): Role {
  if (idOrName in ROLES) return ROLES[idOrName as RoleId];
  const found = Object.values(ROLES).find(r => r.name.toLowerCase() === idOrName.toLowerCase());
  return found ?? ROLES.visitor;
}
