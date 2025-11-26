/**
 * ============================================================
 * MIGRATION: 002 - Perfiles Base del Sistema
 * ============================================================
 * 
 * Crea los perfiles/roles predefinidos del sistema.
 * Depende de: 001-base-permissions
 */

import type { Core } from '@strapi/strapi';

export const id = '002-base-profiles';
export const description = 'Perfiles base del sistema';
export const dependsOn = ['001-base-permissions'];

export interface ProfileData {
  profileId: string;
  name: string;
  description: string;
  permissionIds: string[];
  defaultScope: 'global' | 'workspace' | 'own';
  isSystem: boolean;
}

// Todos los permisos (para superadmin)
const ALL_PERMISSIONS = [
  'inventory.items.read', 'inventory.items.create', 'inventory.items.update', 'inventory.items.delete',
  'inventory.categories.manage', 'inventory.loans.read', 'inventory.loans.manage',
  'iot.devices.read', 'iot.devices.control', 'iot.devices.configure', 'iot.logs.read',
  'blog.posts.read', 'blog.posts.create', 'blog.posts.update', 'blog.posts.delete', 'blog.posts.publish',
  'users.list.read', 'users.profile.read', 'users.profile.update', 'users.accounts.create',
  'users.accounts.delete', 'users.permissions.manage',
  'admin.dashboard.access', 'admin.settings.read', 'admin.settings.update', 'admin.audit.read',
  'reservations.own.read', 'reservations.own.create', 'reservations.own.cancel',
  'reservations.all.read', 'reservations.all.manage',
];

export const data: ProfileData[] = [
  {
    profileId: 'superadmin',
    name: 'Super Administrador',
    description: 'Acceso completo a todo el sistema',
    permissionIds: ['system.all.all'], // Permiso wildcard = acceso total
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'admin',
    name: 'Administrador',
    description: 'Gestión general del FabLab',
    permissionIds: [
      'admin.dashboard.access', 'admin.settings.read',
      'inventory.items.read', 'inventory.items.create', 'inventory.items.update',
      'inventory.categories.manage', 'inventory.loans.read', 'inventory.loans.manage',
      'iot.devices.read', 'iot.devices.control',
      'blog.posts.read', 'blog.posts.create', 'blog.posts.update', 'blog.posts.delete', 'blog.posts.publish',
      'users.list.read', 'users.profile.read', 'users.profile.update', 'users.accounts.create',
      'reservations.all.read', 'reservations.all.manage',
    ],
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'editor',
    name: 'Editor',
    description: 'Gestión de contenido del blog',
    permissionIds: [
      'admin.dashboard.access',
      'blog.posts.read', 'blog.posts.create', 'blog.posts.update', 'blog.posts.publish',
    ],
    defaultScope: 'own',
    isSystem: true,
  },
  {
    profileId: 'inventory_manager',
    name: 'Encargado de Inventario',
    description: 'Gestión completa del inventario',
    permissionIds: [
      'admin.dashboard.access',
      'inventory.items.read', 'inventory.items.create', 'inventory.items.update', 'inventory.items.delete',
      'inventory.categories.manage', 'inventory.loans.read', 'inventory.loans.manage',
    ],
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'iot_operator',
    name: 'Operador IoT',
    description: 'Control de dispositivos IoT',
    permissionIds: [
      'admin.dashboard.access',
      'iot.devices.read', 'iot.devices.control', 'iot.logs.read',
    ],
    defaultScope: 'global',
    isSystem: true,
  },
  {
    profileId: 'member',
    name: 'Miembro FabLab',
    description: 'Usuario regular del FabLab',
    permissionIds: [
      'inventory.items.read', 'inventory.loans.read',
      'blog.posts.read',
      'reservations.own.read', 'reservations.own.create', 'reservations.own.cancel',
    ],
    defaultScope: 'own',
    isSystem: true,
  },
];

export async function up(strapi: Core.Strapi): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  for (const profile of data) {
    const exists = await strapi.db?.query('api::profile.profile').findOne({
      where: { profileId: profile.profileId },
    });

    if (exists) {
      skipped++;
      continue;
    }

    // Obtener IDs de permisos
    const permissionRecords = await strapi.db?.query('api::permission.permission').findMany({
      where: { permissionId: { $in: profile.permissionIds } },
    });

    await strapi.db?.query('api::profile.profile').create({
      data: {
        profileId: profile.profileId,
        name: profile.name,
        description: profile.description,
        defaultScope: profile.defaultScope,
        isSystem: profile.isSystem,
        permissions: permissionRecords?.map((p: { id: number }) => p.id) || [],
      },
    });
    created++;
  }

  return { created, skipped };
}

export async function down(strapi: Core.Strapi): Promise<number> {
  let deleted = 0;

  for (const profile of data) {
    const result = await strapi.db?.query('api::profile.profile').delete({
      where: { profileId: profile.profileId },
    });
    if (result) deleted++;
  }

  return deleted;
}
