/**
 * Projects Collection - Payload CMS
 * 
 * Proyectos realizados en el FabLab.
 * 
 * @categories (fijas según definición del proyecto)
 * - Hardware: Proyectos de electrónica y mecánica
 * - Software: Proyectos de programación
 * - Diseño: Proyectos de diseño 3D, CAD, gráfico
 * - IoT: Proyectos de Internet de las Cosas
 * 
 * @creators
 * - Pueden ser miembros del equipo (relación) o externos (nombre libre)
 * 
 * @links
 * - Array genérico, el usuario define nombre y URL
 */

import type { CollectionConfig } from 'payload';
import { publicRead, isEditor } from '../access';

export const Projects: CollectionConfig = {
    slug: 'projects',
    labels: {
        singular: 'Proyecto',
        plural: 'Proyectos',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'status', 'featured', 'updatedAt'],
        group: 'Proyectos',
    },
    access: {
        read: publicRead,
        create: isEditor,
        update: isEditor,
        delete: isEditor,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Título',
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: 'URL Slug',
        },
        {
            name: 'category',
            type: 'select',
            required: true,
            label: 'Categoría',
            options: [
                { label: 'Hardware', value: 'Hardware' },
                { label: 'Software', value: 'Software' },
                { label: 'Diseño', value: 'Diseño' },
                { label: 'IoT', value: 'IoT' },
            ],
            defaultValue: 'Hardware',
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            label: 'Descripción',
        },
        {
            name: 'content',
            type: 'richText',
            label: 'Contenido Detallado',
        },
        {
            name: 'featuredImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Imagen Principal',
        },
        {
            name: 'gallery',
            type: 'array',
            label: 'Galería',
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
        {
            name: 'technologies',
            type: 'array',
            label: 'Tecnologías',
            admin: { description: 'Herramientas, lenguajes, materiales utilizados' },
            fields: [
                { name: 'name', type: 'text', required: true },
            ],
        },
        {
            name: 'creators',
            type: 'array',
            label: 'Creadores',
            admin: { description: 'Miembros del equipo o colaboradores externos' },
            fields: [
                {
                    name: 'teamMember',
                    type: 'relationship',
                    relationTo: 'users',
                    label: 'Miembro (Usuario)',
                    admin: { description: 'Selecciona un usuario registrado' },
                },
                {
                    name: 'externalName',
                    type: 'text',
                    label: 'Nombre (si es externo)',
                },
                {
                    name: 'role',
                    type: 'text',
                    label: 'Rol en el proyecto',
                },
            ],
        },
        {
            name: 'links',
            type: 'array',
            label: 'Enlaces',
            admin: { description: 'Repositorio, video, documentación, etc.' },
            fields: [
                { name: 'label', type: 'text', required: true, label: 'Nombre' },
                { name: 'url', type: 'text', required: true, label: 'URL' },
            ],
        },
        {
            name: 'year',
            type: 'number',
            label: 'Año',
            defaultValue: new Date().getFullYear(),
            admin: { position: 'sidebar' },
        },
        {
            name: 'featured',
            type: 'checkbox',
            label: 'Destacado',
            defaultValue: false,
            admin: { position: 'sidebar' },
        },
        {
            name: 'status',
            type: 'select',
            label: 'Estado',
            options: [
                { label: 'Borrador', value: 'draft' },
                { label: 'Publicado', value: 'published' },
            ],
            defaultValue: 'draft',
            admin: { position: 'sidebar' },
        },
        {
            name: 'order',
            type: 'number',
            label: 'Orden',
            defaultValue: 0,
            admin: { position: 'sidebar' },
        },
    ],
};
