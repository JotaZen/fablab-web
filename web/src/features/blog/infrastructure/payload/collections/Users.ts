/**
 * Colección de Usuarios para Payload CMS
 * 
 * Gestiona la autenticación y roles de usuarios del CMS
 */

import type { CollectionConfig } from 'payload';

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
        group: 'Administración',
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
        },
    ],
    timestamps: true,
};
