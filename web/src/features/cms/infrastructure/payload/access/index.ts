/**
 * Access Control Helpers - Payload CMS
 *
 * Funciones reutilizables para control de acceso en colecciones y globals.
 * 
 * @example
 * ```typescript
 * import { isAdmin, isEditor, isAdminOrSelf } from '@/features/cms';
 * 
 * // En una colección
 * access: {
 *     read: isEditor,
 *     create: isAdmin,
 *     update: isAdminOrSelf,
 * }
 * ```
 */

import type { Access, FieldAccess } from 'payload';

// Tipos de usuario
export type UserRole = 'admin' | 'editor' | 'author';

export interface PayloadUser {
    id: string;
    email: string;
    role?: UserRole;
}

/**
 * Verifica si el usuario es admin
 */
export const isAdmin: Access = ({ req: { user } }) => {
    return user?.role === 'admin';
};

/**
 * Verifica si el usuario es admin o editor
 */
export const isEditor: Access = ({ req: { user } }) => {
    return user?.role === 'admin' || user?.role === 'editor';
};

/**
 * Verifica si hay un usuario autenticado
 */
export const isAuthenticated: Access = ({ req: { user } }) => {
    return Boolean(user);
};

/**
 * Permite lectura pública
 */
export const publicRead: Access = () => true;

/**
 * Verifica si es admin o el propio usuario
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return { id: { equals: user.id } };
};

/**
 * Field Access: Solo admin puede editar
 */
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
    return user?.role === 'admin';
};

/**
 * Field Access: Solo admin o editor puede editar
 */
export const editorFieldAccess: FieldAccess = ({ req: { user } }) => {
    return user?.role === 'admin' || user?.role === 'editor';
};
