/**
 * Colección de Categorías para Payload CMS
 * 
 * Taxonomía jerárquica para organizar posts
 */

import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
    slug: 'categories',
    labels: {
        singular: 'Categoría',
        plural: 'Categorías',
    },
    admin: {
        useAsTitle: 'name',
        group: 'Contenido',
    },
    access: {
        // Cualquiera puede leer categorías
        read: () => true,
        // Solo admins y editors pueden crear categorías
        create: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            return role === 'admin' || role === 'editor';
        },
        // Solo admins y editors pueden actualizar categorías
        update: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            return role === 'admin' || role === 'editor';
        },
        // Solo admins pueden eliminar categorías
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
            name: 'slug',
            type: 'text',
            label: 'Slug',
            unique: true,
            index: true,
            admin: {
                description: 'URL amigable de la categoría',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Descripción',
        },
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'categories',
            label: 'Categoría Padre',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'icon',
            type: 'text',
            label: 'Icono',
            admin: {
                description: 'Nombre del icono de Lucide (ej: "Cpu", "Printer")',
            },
        },
    ],
    hooks: {
        beforeChange: [
            // Generar slug automáticamente
            ({ data }) => {
                if (data.name && !data.slug) {
                    data.slug = data.name
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                }
                return data;
            },
        ],
    },
    timestamps: true,
};
