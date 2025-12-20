/**
 * Users Collection - Payload CMS
 * 
 * Gestiona la autenticación y roles de usuarios del CMS.
 * 
 * @roles
 * - admin: Acceso completo al sistema
 * - editor: Puede crear y editar contenido
 * - author: Solo puede crear contenido propio
 */

import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrSelf } from '../access';

export const Users: CollectionConfig = {
    slug: 'users',
    labels: {
        singular: 'Usuario',
        plural: 'Usuarios',
    },
    auth: {
        tokenExpiration: 604800, // 7 días
        cookies: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        }
    },
    admin: {
        useAsTitle: 'email',
        group: 'Configuración',
    },
    access: {
        read: isAdminOrSelf,
        create: isAdmin,
        update: isAdminOrSelf,
        delete: isAdmin,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Nombre',
            required: true,
        },
        {
            name: 'avatar',
            type: 'upload',
            relationTo: 'media',
            label: 'Avatar',
        },
        {
            name: 'bio',
            type: 'textarea',
            label: 'Biografía',
        },
        {
            name: 'role',
            type: 'select',
            label: 'Rol',
            options: [
                { label: 'Administrador', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Autor', value: 'author' },
            ],
            defaultValue: 'author',
            required: true,
            access: {
                update: ({ req: { user } }) => user?.role === 'admin',
            },
        },
    ],
    timestamps: true,
};
