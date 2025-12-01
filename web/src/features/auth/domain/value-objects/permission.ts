/**
 * Permission - Todos los permisos posibles del sistema
 */
export type Permission =
  | 'users.create' | 'users.read' | 'users.update' | 'users.delete' | 'users.manage'
  | 'roles.read' | 'roles.manage'
  | 'inventory.read' | 'inventory.manage' | 'inventory.export' | 'inventory.import'
  | 'items.create' | 'items.read' | 'items.update' | 'items.delete' | 'items.manage'
  | 'stock.create' | 'stock.read' | 'stock.update' | 'stock.delete' | 'stock.manage'
  | 'categories.create' | 'categories.read' | 'categories.update' | 'categories.delete'
  | 'locations.create' | 'locations.read' | 'locations.update' | 'locations.delete'
  | 'iot.read' | 'iot.manage'
  | 'devices.create' | 'devices.read' | 'devices.update' | 'devices.delete' | 'devices.manage'
  | 'blog.read' | 'blog.manage'
  | 'posts.create' | 'posts.read' | 'posts.update' | 'posts.delete'
  | 'settings.read' | 'settings.manage'
  | 'reports.read' | 'reports.export';

export const ALL_PERMISSIONS: Permission[] = [
  'users.create', 'users.read', 'users.update', 'users.delete', 'users.manage',
  'roles.read', 'roles.manage',
  'inventory.read', 'inventory.manage', 'inventory.export', 'inventory.import',
  'items.create', 'items.read', 'items.update', 'items.delete', 'items.manage',
  'stock.create', 'stock.read', 'stock.update', 'stock.delete', 'stock.manage',
  'categories.create', 'categories.read', 'categories.update', 'categories.delete',
  'locations.create', 'locations.read', 'locations.update', 'locations.delete',
  'iot.read', 'iot.manage',
  'devices.create', 'devices.read', 'devices.update', 'devices.delete', 'devices.manage',
  'blog.read', 'blog.manage',
  'posts.create', 'posts.read', 'posts.update', 'posts.delete',
  'settings.read', 'settings.manage',
  'reports.read', 'reports.export',
];
