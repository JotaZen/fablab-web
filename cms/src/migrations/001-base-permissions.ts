/**
 * ============================================================
 * MIGRATION: 001 - Permisos Base del Sistema
 * ============================================================
 * 
 * Crea los permisos fundamentales del sistema FabLab.
 * Ejecutar: npm run migrate
 */

import type { Core } from '@strapi/strapi';

export const id = '001-base-permissions';
export const description = 'Permisos base del sistema';

export interface PermissionData {
  permissionId: string;
  description: string;
  category: 'system' | 'inventory' | 'iot' | 'blog' | 'users' | 'admin' | 'reservations';
}

export const data: PermissionData[] = [
  // ==================== SISTEMA (GLOBAL) ====================
  { permissionId: 'system.all.all', description: 'Acceso total al sistema (wildcard)', category: 'system' },

  // ==================== INVENTARIO ====================
  { permissionId: 'inventory.items.read', description: 'Ver items del inventario', category: 'inventory' },
  { permissionId: 'inventory.items.create', description: 'Crear items en el inventario', category: 'inventory' },
  { permissionId: 'inventory.items.update', description: 'Editar items del inventario', category: 'inventory' },
  { permissionId: 'inventory.items.delete', description: 'Eliminar items del inventario', category: 'inventory' },
  { permissionId: 'inventory.categories.manage', description: 'Gestionar categorías', category: 'inventory' },
  { permissionId: 'inventory.loans.read', description: 'Ver préstamos', category: 'inventory' },
  { permissionId: 'inventory.loans.manage', description: 'Gestionar préstamos', category: 'inventory' },

  // ==================== IOT ====================
  { permissionId: 'iot.devices.read', description: 'Ver dispositivos IoT', category: 'iot' },
  { permissionId: 'iot.devices.control', description: 'Controlar dispositivos IoT', category: 'iot' },
  { permissionId: 'iot.devices.configure', description: 'Configurar dispositivos IoT', category: 'iot' },
  { permissionId: 'iot.logs.read', description: 'Ver logs IoT', category: 'iot' },

  // ==================== BLOG ====================
  { permissionId: 'blog.posts.read', description: 'Ver posts', category: 'blog' },
  { permissionId: 'blog.posts.create', description: 'Crear posts', category: 'blog' },
  { permissionId: 'blog.posts.update', description: 'Editar posts', category: 'blog' },
  { permissionId: 'blog.posts.delete', description: 'Eliminar posts', category: 'blog' },
  { permissionId: 'blog.posts.publish', description: 'Publicar posts', category: 'blog' },

  // ==================== USUARIOS ====================
  { permissionId: 'users.list.read', description: 'Ver lista de usuarios', category: 'users' },
  { permissionId: 'users.profile.read', description: 'Ver perfiles', category: 'users' },
  { permissionId: 'users.profile.update', description: 'Editar perfiles', category: 'users' },
  { permissionId: 'users.accounts.create', description: 'Crear cuentas', category: 'users' },
  { permissionId: 'users.accounts.delete', description: 'Eliminar cuentas', category: 'users' },
  { permissionId: 'users.permissions.manage', description: 'Gestionar permisos', category: 'users' },

  // ==================== ADMIN ====================
  { permissionId: 'admin.dashboard.access', description: 'Acceder al admin', category: 'admin' },
  { permissionId: 'admin.settings.read', description: 'Ver configuración', category: 'admin' },
  { permissionId: 'admin.settings.update', description: 'Modificar configuración', category: 'admin' },
  { permissionId: 'admin.audit.read', description: 'Ver auditoría', category: 'admin' },

  // ==================== RESERVACIONES ====================
  { permissionId: 'reservations.own.read', description: 'Ver mis reservas', category: 'reservations' },
  { permissionId: 'reservations.own.create', description: 'Crear mis reservas', category: 'reservations' },
  { permissionId: 'reservations.own.cancel', description: 'Cancelar mis reservas', category: 'reservations' },
  { permissionId: 'reservations.all.read', description: 'Ver todas las reservas', category: 'reservations' },
  { permissionId: 'reservations.all.manage', description: 'Gestionar reservas', category: 'reservations' },
];

export async function up(strapi: Core.Strapi): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  for (const permission of data) {
    const exists = await strapi.db?.query('api::permission.permission').findOne({
      where: { permissionId: permission.permissionId },
    });

    if (exists) {
      skipped++;
      continue;
    }

    await strapi.db?.query('api::permission.permission').create({
      data: {
        permissionId: permission.permissionId,
        description: permission.description,
        category: permission.category,
        isActive: true,
      },
    });
    created++;
  }

  return { created, skipped };
}

export async function down(strapi: Core.Strapi): Promise<number> {
  let deleted = 0;

  for (const permission of data) {
    const result = await strapi.db?.query('api::permission.permission').delete({
      where: { permissionId: permission.permissionId },
    });
    if (result) deleted++;
  }

  return deleted;
}
