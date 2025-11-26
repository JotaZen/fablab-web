/**
 * ============================================================
 * MIGRATION RUNNER
 * ============================================================
 * 
 * Ejecuta las migraciones de datos en orden.
 * Uso: npm run migrate
 */

import type { Core } from '@strapi/strapi';

// Importar migraciones
import * as migration001 from './001-base-permissions';
import * as migration002 from './002-base-profiles';
import * as migration003 from './003-assign-global-permission';
import * as migration004 from './004-strapi-permissions';

// Re-exportar funciones útiles
export { 
  assignGlobalPermission, 
  revokeGlobalPermission, 
  listSuperUsers 
} from './003-assign-global-permission';

export interface Migration {
  id: string;
  description: string;
  dependsOn?: string[];
  up: (strapi: Core.Strapi) => Promise<{ created: number; skipped: number }>;
  down: (strapi: Core.Strapi) => Promise<number>;
}

// Registro de migraciones en orden
export const migrations: Migration[] = [
  migration001,
  migration002,
  migration003,
  migration004,
];

export interface MigrationResult {
  id: string;
  description: string;
  status: 'success' | 'skipped' | 'error';
  created?: number;
  skipped?: number;
  error?: string;
}

/**
 * Ejecuta todas las migraciones pendientes
 */
export async function runMigrations(strapi: Core.Strapi): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  console.log('\n📦 Ejecutando migraciones de datos...\n');

  for (const migration of migrations) {
    try {
      console.log(`   ▶ ${migration.id}: ${migration.description}`);
      
      const result = await migration.up(strapi);
      
      if (result.created > 0) {
        console.log(`     ✅ ${result.created} creados, ${result.skipped} existentes`);
        results.push({
          id: migration.id,
          description: migration.description,
          status: 'success',
          created: result.created,
          skipped: result.skipped,
        });
      } else {
        console.log(`     ⏭️  Todos existentes (${result.skipped})`);
        results.push({
          id: migration.id,
          description: migration.description,
          status: 'skipped',
          skipped: result.skipped,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      console.log(`     ❌ Error: ${errorMsg}`);
      results.push({
        id: migration.id,
        description: migration.description,
        status: 'error',
        error: errorMsg,
      });
    }
  }

  console.log('\n✅ Migraciones completadas\n');

  return results;
}

/**
 * Ejecuta una migración específica
 */
export async function runMigration(
  strapi: Core.Strapi,
  migrationId: string
): Promise<MigrationResult> {
  const migration = migrations.find(m => m.id === migrationId);
  
  if (!migration) {
    return {
      id: migrationId,
      description: 'No encontrada',
      status: 'error',
      error: `Migración '${migrationId}' no existe`,
    };
  }

  try {
    const result = await migration.up(strapi);
    return {
      id: migration.id,
      description: migration.description,
      status: result.created > 0 ? 'success' : 'skipped',
      created: result.created,
      skipped: result.skipped,
    };
  } catch (error) {
    return {
      id: migration.id,
      description: migration.description,
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Revierte una migración específica
 */
export async function rollbackMigration(
  strapi: Core.Strapi,
  migrationId: string
): Promise<{ deleted: number; error?: string }> {
  const migration = migrations.find(m => m.id === migrationId);
  
  if (!migration) {
    return { deleted: 0, error: `Migración '${migrationId}' no existe` };
  }

  try {
    const deleted = await migration.down(strapi);
    return { deleted };
  } catch (error) {
    return {
      deleted: 0,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Lista todas las migraciones disponibles
 */
export function listMigrations(): Array<{ id: string; description: string }> {
  return migrations.map(m => ({
    id: m.id,
    description: m.description,
  }));
}
