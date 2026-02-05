/**
 * Equipment Requests Collection - Payload CMS
 * 
 * Solicitudes de nuevos equipos por parte de los usuarios.
 * 
 * @status
 * - pending: Pendiente de revisión
 * - approved: Aprobada
 * - rejected: Rechazada
 */

import type { CollectionConfig } from 'payload';

export const EquipmentRequests: CollectionConfig = {
    slug: 'equipment-requests',
    labels: {
        singular: 'Solicitud de Equipo',
        plural: 'Solicitudes de Equipos',
    },
    admin: {
        useAsTitle: 'equipmentName',
        defaultColumns: ['equipmentName', 'requestedBy', 'status', 'createdAt'],
        group: 'Equipamiento',
        description: 'Solicitudes de nuevos equipos',
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'equipmentName',
            type: 'text',
            required: true,
            label: 'Nombre del Equipo',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Descripción',
        },
        {
            name: 'quantity',
            type: 'number',
            required: true,
            defaultValue: 1,
            min: 1,
            label: 'Cantidad',
        },
        {
            name: 'justification',
            type: 'textarea',
            required: true,
            label: 'Justificación',
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'pending',
            label: 'Estado',
            options: [
                { label: 'Pendiente', value: 'pending' },
                { label: 'Aprobada', value: 'approved' },
                { label: 'Rechazada', value: 'rejected' },
            ],
        },
        {
            name: 'requestedBy',
            type: 'relationship',
            relationTo: 'users',
            label: 'Solicitado por',
        },
        {
            name: 'reviewedBy',
            type: 'relationship',
            relationTo: 'users',
            label: 'Revisado por',
        },
        {
            name: 'reviewNotes',
            type: 'textarea',
            label: 'Notas de revisión',
        },
    ],
    timestamps: true,
};
