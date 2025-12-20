/**
 * Colección de Posts para Payload CMS
 * 
 * Blog posts con soporte para editor de texto enriquecido, 
 * categorías, etiquetas e imágenes destacadas
 */

import type { CollectionConfig, Access, Where } from 'payload';

export const Posts: CollectionConfig = {
    slug: 'posts',
    labels: {
        singular: 'Post',
        plural: 'Posts',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'author', 'publishedAt'],
        group: 'Contenido',
    },
    access: {
        // Cualquiera puede leer posts publicados
        read: ({ req: { user } }) => {
            // Si es usuario autenticado, puede ver todos
            if (user) return true;
            // Si no, solo posts publicados
            return {
                status: {
                    equals: 'published',
                },
            };
        },
        // Solo usuarios autenticados pueden crear posts
        create: ({ req: { user } }) => {
            if (!user) return false;
            return true;
        },
        // Admins y editors pueden actualizar cualquier post, authors solo los suyos
        update: ({ req: { user } }) => {
            if (!user) return false;
            const role = (user as any).role;
            // Admins y editors pueden actualizar todo
            if (role === 'admin' || role === 'editor') return true;
            // Authors solo pueden actualizar sus propios posts
            return {
                author: {
                    equals: user.id,
                },
            };
        },
        // Solo admins pueden eliminar, o authors pueden eliminar sus borradores
        delete: (({ req: { user } }) => {
            if (!user) return false;
            const role = (user as { role?: string }).role;
            // Solo admins pueden eliminar cualquier post
            if (role === 'admin') return true;
            // Editors y Authors con restricciones
            const condition: Where = {
                status: { not_equals: 'published' as const },
            };
            // Authors también necesitan ser dueños del post
            if (role !== 'editor') {
                condition.author = { equals: user.id };
            }
            return condition;
        }) as Access,
    },
    hooks: {
        beforeChange: [
            // Generar slug automáticamente si no existe y asegurar unicidad
            async ({ data, originalDoc, req }) => {
                if (data.title && !data.slug) {
                    data.slug = data.title
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                }

                if (data.slug) {
                    // If slug doesn't have YYYY/MM format (simple check for slash), prepend date
                    if (!data.slug.includes('/')) {
                        const date = new Date(data.publishedAt || data.createdAt || new Date());
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        data.slug = `${year}/${month}/${data.slug}`;
                    }

                    const collection = 'posts';
                    let slug = data.slug;
                    let counter = 1;

                    // Check if slug exists (exclude current doc if updating)
                    while (true) {
                        const existingPosts = await req.payload.find({
                            collection,
                            where: {
                                slug: { equals: slug },
                                id: { not_equals: originalDoc?.id },
                            },
                        });

                        if (existingPosts.docs.length === 0) {
                            break;
                        }

                        slug = `${data.slug}-${counter}`;
                        counter++;
                    }

                    data.slug = slug;
                }

                return data;
            },
        ],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Título',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            label: 'Slug',
            unique: true,
            admin: {
                position: 'sidebar',
                description: 'URL amigable del post (se genera automáticamente)',
            },
            index: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            label: 'Extracto',
            admin: {
                description: 'Resumen corto del post para listados y SEO',
            },
        },
        {
            name: 'featuredImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Imagen Destacada',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'content',
            type: 'richText',
            label: 'Contenido',
            required: true,
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            label: 'Autor',
            admin: {
                position: 'sidebar',
            },
            hasMany: false,
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            label: 'Categorías',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'tags',
            type: 'array',
            label: 'Etiquetas',
            labels: {
                singular: 'Etiqueta',
                plural: 'Etiquetas',
            },
            admin: {
                position: 'sidebar',
            },
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                    label: 'Etiqueta',
                },
            ],
        },
        {
            name: 'status',
            type: 'select',
            label: 'Estado',
            options: [
                { label: 'Borrador', value: 'draft' },
                { label: 'Publicado', value: 'published' },
                { label: 'Archivado', value: 'archived' },
            ],
            defaultValue: 'draft',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'publishedAt',
            type: 'date',
            label: 'Fecha de Publicación',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'views',
            type: 'number',
            label: 'Vistas',
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
        // SEO Fields
        {
            name: 'seo',
            type: 'group',
            label: 'SEO',
            admin: {
                description: 'Optimización para motores de búsqueda',
            },
            fields: [
                {
                    name: 'metaTitle',
                    type: 'text',
                    label: 'Meta Título',
                },
                {
                    name: 'metaDescription',
                    type: 'textarea',
                    label: 'Meta Descripción',
                },
                {
                    name: 'keywords',
                    type: 'text',
                    label: 'Palabras Clave',
                    admin: {
                        description: 'Separadas por comas',
                    },
                },
            ],
        },
    ],
    timestamps: true,
};
