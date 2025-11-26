/**
 * ============================================================
 * Admin Migration Controller
 * ============================================================
 * 
 * Endpoints protegidos para ejecutar migraciones de datos base.
 * Solo accesibles por superadmin.
 */

import type { Core } from '@strapi/strapi';
import { 
  runMigrations, 
  runMigration, 
  rollbackMigration, 
  listMigrations,
  type MigrationResult 
} from '../../../migrations';

// UID del Content-Type para registros de migración
const MIGRATION_UID = 'api::admin-migration.admin-migration' as const;

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * GET /api/admin-migrations/list
   * Lista todas las migraciones disponibles y su estado
   */
  async list(ctx) {
    try {
      const available = listMigrations();
      
      // Obtener migraciones ejecutadas de la BD
      const executed = await strapi.documents(MIGRATION_UID).findMany({}) as any[];

      const executedMap = new Map(
        executed.map((e: any) => [e.migrationId, e])
      );

      const migrations = available.map(m => ({
        ...m,
        executed: executedMap.has(m.id),
        lastRun: executedMap.get(m.id) || null,
      }));

      ctx.body = {
        data: migrations,
        meta: {
          total: available.length,
          executed: executed.length,
          pending: available.length - executed.length,
        },
      };
    } catch (error: any) {
      ctx.throw(500, `Error listando migraciones: ${error.message}`);
    }
  },

  /**
   * POST /api/admin-migrations/run
   * Ejecuta todas las migraciones pendientes
   */
  async runAll(ctx) {
    try {
      console.log('\n🚀 Iniciando migraciones...\n');
      
      const results = await runMigrations(strapi);
      
      // Guardar registro de las ejecuciones
      for (const result of results) {
        await saveExecutionRecord(strapi, result, ctx.state.user?.email || 'api');
      }

      const summary = {
        success: results.filter(r => r.status === 'success').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        error: results.filter(r => r.status === 'error').length,
      };

      ctx.body = {
        data: results,
        meta: summary,
        message: summary.error > 0 
          ? 'Algunas migraciones fallaron' 
          : 'Migraciones completadas exitosamente',
      };
    } catch (error: any) {
      ctx.throw(500, `Error ejecutando migraciones: ${error.message}`);
    }
  },

  /**
   * POST /api/admin-migrations/run/:id
   * Ejecuta una migración específica
   */
  async runOne(ctx) {
    const { id } = ctx.params;
    
    if (!id) {
      ctx.throw(400, 'ID de migración requerido');
    }

    try {
      console.log(`\n▶ Ejecutando migración: ${id}\n`);
      
      const result = await runMigration(strapi, id);
      
      // Guardar registro
      await saveExecutionRecord(strapi, result, ctx.state.user?.email || 'api');

      if (result.status === 'error') {
        ctx.throw(400, result.error);
      }

      ctx.body = {
        data: result,
        message: result.status === 'success' 
          ? 'Migración ejecutada exitosamente'
          : 'Migración saltada (ya existía)',
      };
    } catch (error: any) {
      ctx.throw(500, `Error ejecutando migración ${id}: ${error.message}`);
    }
  },

  /**
   * DELETE /api/admin-migrations/rollback/:id
   * Revierte una migración específica (PELIGROSO)
   */
  async rollback(ctx) {
    const { id } = ctx.params;
    const { confirm } = ctx.request.body as { confirm?: string } || {};

    if (!id) {
      ctx.throw(400, 'ID de migración requerido');
    }

    if (confirm !== 'DELETE_ALL_DATA') {
      ctx.throw(400, 'Debes confirmar con { "confirm": "DELETE_ALL_DATA" }');
    }

    try {
      console.log(`\n⏪ Revirtiendo migración: ${id}\n`);
      
      const result = await rollbackMigration(strapi, id);

      if (result.error) {
        ctx.throw(400, result.error);
      }

      // Eliminar registro de migración
      const existing = await strapi.documents(MIGRATION_UID).findFirst({
        filters: { migrationId: id },
      }) as any;

      if (existing) {
        await strapi.documents(MIGRATION_UID).delete({
          documentId: existing.documentId,
        });
      }

      ctx.body = {
        data: result,
        message: `Migración ${id} revertida. ${result.deleted} registros eliminados.`,
      };
    } catch (error: any) {
      ctx.throw(500, `Error revirtiendo migración ${id}: ${error.message}`);
    }
  },
});

/**
 * Guarda un registro de la ejecución de una migración
 */
async function saveExecutionRecord(
  strapi: Core.Strapi, 
  result: MigrationResult, 
  executedBy: string
) {
  try {
    // Buscar si ya existe un registro para esta migración
    const existing = await strapi.documents(MIGRATION_UID).findFirst({
      filters: { migrationId: result.id },
    }) as any;

    const data = {
      migrationId: result.id,
      description: result.description,
      status: result.status,
      created: result.created || 0,
      skipped: result.skipped || 0,
      executedAt: new Date().toISOString(),
      executedBy,
      error: result.error || null,
    };

    if (existing) {
      await strapi.documents(MIGRATION_UID).update({
        documentId: existing.documentId,
        data,
      });
    } else {
      await strapi.documents(MIGRATION_UID).create({
        data,
      });
    }
  } catch (error) {
    console.error('Error guardando registro de migración:', error);
  }
}
