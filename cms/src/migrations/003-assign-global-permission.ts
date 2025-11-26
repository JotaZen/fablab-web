/**
 * ============================================================
 * MIGRATION: 003 - Asignar Permiso Global a Usuario
 * ============================================================
 * 
 * Esta migración asigna el permiso system.all.all a un usuario
 * específico. Debes ejecutarla pasando el email del usuario.
 * 
 * Uso desde consola:
 *   const { assignGlobalPermission } = require('./dist/src/migrations/003-assign-global-permission');
 *   await assignGlobalPermission(strapi, 'admin@fablab.cl');
 */

import type { Core } from '@strapi/strapi';

export const id = '003-assign-global-permission';
export const description = 'Asignar permiso global a usuario';
export const dependsOn = ['001-base-permissions'];

const GLOBAL_PERMISSION_ID = 'system.all.all';

/**
 * Asigna el permiso global (system.all.all) a un usuario por email
 */
export async function assignGlobalPermission(
  strapi: Core.Strapi,
  userEmail: string
): Promise<{ success: boolean; message: string }> {
  
  // 1. Buscar el usuario
  const user = await strapi.db?.query('plugin::users-permissions.user').findOne({
    where: { email: userEmail },
  });

  if (!user) {
    return { 
      success: false, 
      message: `❌ Usuario con email '${userEmail}' no encontrado` 
    };
  }

  console.log(`👤 Usuario encontrado: ${user.username} (ID: ${user.id})`);

  // 2. Buscar el permiso global
  let permission = await strapi.db?.query('api::permission.permission').findOne({
    where: { permissionId: GLOBAL_PERMISSION_ID },
  });

  // Si no existe, crearlo
  if (!permission) {
    console.log(`📦 Creando permiso ${GLOBAL_PERMISSION_ID}...`);
    permission = await strapi.db?.query('api::permission.permission').create({
      data: {
        permissionId: GLOBAL_PERMISSION_ID,
        description: 'Acceso total al sistema (wildcard)',
        category: 'system',
        isActive: true,
      },
    });
  }

  console.log(`🔑 Permiso: ${permission.permissionId} (ID: ${permission.id})`);

  // 3. Verificar si ya tiene el permiso asignado
  const existingAssignment = await strapi.db?.query('api::user-permission.user-permission').findOne({
    where: {
      user: user.id,
      permission: permission.id,
    },
  });

  if (existingAssignment) {
    return {
      success: true,
      message: `⏭️ El usuario '${user.username}' ya tiene el permiso global asignado`,
    };
  }

  // 4. Asignar el permiso
  await strapi.db?.query('api::user-permission.user-permission').create({
    data: {
      user: user.id,
      permission: permission.id,
      scope: 'global',
      grantedAt: new Date().toISOString(),
    },
  });

  return {
    success: true,
    message: `✅ Permiso global asignado a '${user.username}' exitosamente`,
  };
}

/**
 * Lista usuarios con permiso global
 */
export async function listSuperUsers(strapi: Core.Strapi): Promise<string[]> {
  const permission = await strapi.db?.query('api::permission.permission').findOne({
    where: { permissionId: GLOBAL_PERMISSION_ID },
  });

  if (!permission) {
    return [];
  }

  const assignments = await strapi.db?.query('api::user-permission.user-permission').findMany({
    where: { permission: permission.id },
    populate: ['user'],
  });

  return assignments?.map((a: any) => a.user?.email).filter(Boolean) || [];
}

/**
 * Revoca el permiso global de un usuario
 */
export async function revokeGlobalPermission(
  strapi: Core.Strapi,
  userEmail: string
): Promise<{ success: boolean; message: string }> {
  
  const user = await strapi.db?.query('plugin::users-permissions.user').findOne({
    where: { email: userEmail },
  });

  if (!user) {
    return { success: false, message: `Usuario '${userEmail}' no encontrado` };
  }

  const permission = await strapi.db?.query('api::permission.permission').findOne({
    where: { permissionId: GLOBAL_PERMISSION_ID },
  });

  if (!permission) {
    return { success: false, message: 'Permiso global no existe' };
  }

  const deleted = await strapi.db?.query('api::user-permission.user-permission').delete({
    where: {
      user: user.id,
      permission: permission.id,
    },
  });

  if (deleted) {
    return { success: true, message: `✅ Permiso global revocado de '${user.username}'` };
  }

  return { success: false, message: 'El usuario no tenía el permiso global' };
}

// Para compatibilidad con el sistema de migraciones
export async function up(strapi: Core.Strapi): Promise<{ created: number; skipped: number }> {
  // Esta migración no crea nada automáticamente
  // Debes usar assignGlobalPermission manualmente
  console.log('\n⚠️  Esta migración requiere ejecución manual:');
  console.log('   const { assignGlobalPermission } = require("./dist/src/migrations/003-assign-global-permission");');
  console.log('   await assignGlobalPermission(strapi, "tu@email.com");\n');
  return { created: 0, skipped: 0 };
}

export async function down(strapi: Core.Strapi): Promise<number> {
  // No hace nada automáticamente
  return 0;
}
