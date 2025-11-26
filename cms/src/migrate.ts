/**
 * ============================================================
 * Servicio de Migraciones
 * ============================================================
 * 
 * Este módulo exporta las funciones de migración para ser usadas
 * desde el API de Strapi (endpoint protegido) o desde la consola.
 * 
 * Uso desde consola de Strapi:
 *   npm run strapi console
 *   > const migrations = require('./src/migrations');
 *   > await migrations.runMigrations(strapi);
 */

export { 
  runMigrations, 
  runMigration, 
  rollbackMigration, 
  listMigrations,
  type MigrationResult 
} from './migrations';
