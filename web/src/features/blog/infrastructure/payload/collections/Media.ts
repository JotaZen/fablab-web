/**
 * Colección de Media para Payload CMS
 * 
 * Gestiona archivos multimedia (imágenes, documentos)
 * con generación automática de thumbnails y optimización
 */

import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
    slug: 'media',
    labels: {
        singular: 'Archivo',
        plural: 'Archivos',
    },
    admin: {
        useAsTitle: 'alt',
        group: 'Contenido',
    },
    access: {
        read: () => true,
    },
    upload: {
        staticDir: 'media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre',
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*', 'application/pdf'],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            label: 'Texto Alternativo',
            required: true,
            admin: {
                description: 'Descripción de la imagen para accesibilidad y SEO',
            },
        },
        {
            name: 'caption',
            type: 'text',
            label: 'Leyenda',
        },
    ],
    timestamps: true,
};
