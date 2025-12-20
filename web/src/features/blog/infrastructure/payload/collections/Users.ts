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
    access: {
        // Los usuarios autenticados pueden verse a sí mismos, admins ven todos
        read: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            if (role === 'admin') return true;
            // Los demás solo pueden ver su propio perfil
            return {
                id: { equals: user.id },
            };
        },
        // Solo admins pueden crear usuarios (registro es aparte)
        create: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            return role === 'admin';
        },
        // Usuarios pueden actualizar su propio perfil, admins pueden actualizar todos
        update: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            if (role === 'admin') return true;
            return {
                id: { equals: user.id },
            };
        },
        // Solo admins pueden eliminar usuarios
        delete: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            return role === 'admin';
        },
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
