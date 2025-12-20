/**
 * Feature: CMS
 * 
 * Centraliza toda la configuración de Payload CMS.
 * Ver README.md para documentación completa.
 * 
 * @example
 * ```typescript
 * // En payload.config.ts
 * import { collections, globals } from '@/features/cms';
 * 
 * export default buildConfig({
 *     collections,
 *     globals,
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // En otras features
 * import { isAdmin, isEditor } from '@/features/cms';
 * ```
 */

// Re-exporta todo desde la infraestructura de Payload
export * from './infrastructure/payload';
