/**
 * ============================================================
 * MIGRATION: 004 - Configurar Permisos de Strapi
 * ============================================================
 * 
 * Configura los permisos del plugin Users & Permissions de Strapi
 * para que los usuarios autenticados puedan acceder a las APIs.
 * 
 * IMPORTANTE: Esta migración crea los permisos directamente en la BD
 * si no existen, evitando la necesidad de configurar manualmente
 * desde el panel de admin de Strapi.
 */

import type { Core } from '@strapi/strapi';
import crypto from 'crypto';

export const id = '004-strapi-permissions';
export const description = 'Configurar permisos de API de Strapi para usuarios autenticados';

const generateDocId = () => crypto.randomBytes(12).toString('hex').slice(0, 24);

// Permisos de API que necesita el rol Authenticated
const AUTHENTICATED_PERMISSIONS = [
  // Posts (Blog) - CRUD completo
  'api::post.post.find',
  'api::post.post.findOne',
  'api::post.post.create',
  'api::post.post.update',
  'api::post.post.delete',
  
  // Permisos FabLab (lectura)
  'api::permission.permission.find',
  'api::permission.permission.findOne',
  
  // Perfiles FabLab (lectura)
  'api::profile.profile.find',
  'api::profile.profile.findOne',
  
  // User-Permissions (lectura)
  'api::user-permission.user-permission.find',
  'api::user-permission.user-permission.findOne',
  
  // My-Permissions (endpoint personalizado)
  'api::my-permissions.my-permissions.find',
  
  // Admin-Migrations
  'api::admin-migration.admin-migration.list',
  'api::admin-migration.admin-migration.runAll',
  'api::admin-migration.admin-migration.runOne',
];

export async function up(strapi: Core.Strapi): Promise<{ created: number; skipped: number }> {
  const knex = strapi.db?.connection;
  if (!knex) {
    throw new Error('No hay conexión a la base de datos');
  }

  // Buscar el rol Authenticated
  const authenticatedRole = await knex('up_roles')
    .where({ type: 'authenticated' })
    .first();

  if (!authenticatedRole) {
    console.log('❌ Rol Authenticated no encontrado');
    return { created: 0, skipped: 0 };
  }

  const roleId = authenticatedRole.id;
  console.log(`\n🔧 Configurando permisos para rol Authenticated (ID: ${roleId})\n`);

  let created = 0;
  let skipped = 0;
  const now = Date.now();

  for (const action of AUTHENTICATED_PERMISSIONS) {
    // Verificar si el permiso ya existe
    let permission = await knex('up_permissions')
      .where({ action })
      .first();

    if (!permission) {
      // Crear el permiso
      const docId = generateDocId();
      await knex('up_permissions').insert({
        document_id: docId,
        action,
        created_at: now,
        updated_at: now,
        published_at: now,
      });
      permission = await knex('up_permissions').where({ document_id: docId }).first();
      console.log(`   ✅ Permiso creado: ${action}`);
    }

    // Verificar si está vinculado al rol
    const link = await knex('up_permissions_role_lnk')
      .where({ permission_id: permission.id, role_id: roleId })
      .first();

    if (!link) {
      // Vincular al rol
      await knex('up_permissions_role_lnk').insert({
        permission_id: permission.id,
        role_id: roleId,
        permission_ord: 1,
      });
      console.log(`   🔗 Vinculado al rol: ${action}`);
      created++;
    } else {
      console.log(`   ⏭️  Ya configurado: ${action}`);
      skipped++;
    }
  }

  console.log(`\n✅ Permisos de API configurados: ${created} nuevos, ${skipped} existentes`);
  return { created, skipped };
}

export async function down(strapi: Core.Strapi): Promise<number> {
  console.log('⚠️  Los permisos de Strapi no se revierten automáticamente por seguridad');
  return 0;
}
