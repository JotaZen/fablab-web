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
            name: 'jobTitle', // Campo simple para mostrar en admin/otros lados
            type: 'text',
            label: 'Cargo / Especialidad',
            admin: {
                description: 'Ej: Ingeniero Electrónico, Diseñador 3D',
            },
        },
        // --- Campos para Sección Equipo ---
        {
            name: 'showInTeam',
            type: 'checkbox',
            label: 'Mostrar en Sección Equipo',
            defaultValue: false,
        },
        {
            name: 'category',
            type: 'select',
            label: 'Categoría de Equipo',
            options: [
                { label: 'Equipo Directivo', value: 'leadership' },
                { label: 'Especialista', value: 'specialist' },
                { label: 'Colaborador', value: 'collaborator' },
            ],
            defaultValue: 'specialist',
            admin: {
                condition: (data) => Boolean(data?.showInTeam),
            }
        },
        {
            name: 'experience',
            type: 'text',
            label: 'Experiencia (ej: "15+ años")',
            admin: {
                condition: (data) => Boolean(data?.showInTeam),
            }
        },
        {
            name: 'achievements',
            type: 'array',
            label: 'Logros Destacados',
            fields: [
                { name: 'achievement', type: 'text' },
            ],
            admin: {
                condition: (data) => Boolean(data?.showInTeam),
            }
        },
        {
            name: 'order',
            type: 'number',
            label: 'Orden de visualización',
            defaultValue: 99,
            min: 0,
        },
        // ----------------------------------
        {
            name: 'linkedin',
            type: 'text',
            label: 'LinkedIn URL',
        },
        {
            name: 'github',
            type: 'text',
            label: 'GitHub URL',
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
