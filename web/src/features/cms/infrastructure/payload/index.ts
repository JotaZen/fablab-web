/**
 * Payload CMS Infrastructure
 * 
 * Punto de entrada para toda la configuración de Payload.
 * 
 * @example
 * ```typescript
 * // En payload.config.ts
 * import { collections, globals } from '@/features/cms/infrastructure/payload';
 * 
 * export default buildConfig({
 *     collections,
 *     globals,
 * });
 * ```
 */

// Colecciones
export { collections } from './collections';
export { Users, Media, Posts, Categories, TeamMembers, Projects, EquipmentRequests, EquipmentUsage } from './collections';

// Globals
export { globals } from './globals';
export { EquipoPage } from './globals';

// Access helpers
export {
    isAdmin,
    isEditor,
    isAuthenticated,
    publicRead,
    isAdminOrSelf,
    adminFieldAccess,
    editorFieldAccess,
    type UserRole,
    type PayloadUser,
} from './access';
