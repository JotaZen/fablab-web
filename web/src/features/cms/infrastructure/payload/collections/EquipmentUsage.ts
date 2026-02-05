/**
 * Equipment Usage Collection - Payload CMS
 * 
 * Registro del historial de uso de equipos.
 * 
 * @status
 * - active: En uso actualmente
 * - completed: Uso finalizado
 */

import type { CollectionConfig } from 'payload';

export const EquipmentUsage: CollectionConfig = {
    slug: 'equipment-usage',
    labels: {
        singular: 'Uso de Equipo',
        plural: 'Usos de Equipos',
    },
    admin: {
        useAsTitle: 'equipmentName',
        defaultColumns: ['equipmentName', 'user', 'status', 'startTime'],
        group: 'Equipamiento',
        description: 'Historial de uso de equipos',
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'equipmentId',
            type: 'text',
            required: true,
            label: 'ID del Equipo',
            index: true,
        },
        {
            name: 'equipmentName',
            type: 'text',
            required: true,
            label: 'Nombre del Equipo',
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Usuario',
        },
        {
            name: 'userName',
            type: 'text',
            label: 'Nombre del Usuario',
            admin: {
                description: 'Nombre del usuario al momento del uso (para historial)',
            },
        },
        {
            name: 'startTime',
            type: 'date',
            required: true,
            label: 'Inicio del uso',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'endTime',
            type: 'date',
            label: 'Fin del uso',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'estimatedDuration',
            type: 'select',
            required: true,
            label: 'Duración estimada',
            options: [
                { label: '30 minutos', value: '30min' },
                { label: '1 hora', value: '1h' },
                { label: '2 horas', value: '2h' },
                { label: '4 horas', value: '4h' },
                { label: '8 horas (día completo)', value: '8h' },
                { label: '1 día', value: '1d' },
                { label: '2 días', value: '2d' },
                { label: '1 semana', value: '1w' },
            ],
            defaultValue: '1h',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Descripción / Notas',
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'active',
            label: 'Estado',
            options: [
                { label: 'En uso', value: 'active' },
                { label: 'Completado', value: 'completed' },
            ],
            index: true,
        },
    ],
    timestamps: true,
};
