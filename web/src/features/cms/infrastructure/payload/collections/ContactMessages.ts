/**
 * Contact Messages Collection - Payload CMS
 * 
 * Almacena los mensajes de contacto enviados desde el formulario público.
 * Solo los administradores pueden ver estos mensajes.
 * 
 * @access
 * - read: Solo admin
 * - create: Público (sin autenticación)
 * - update: Solo admin
 * - delete: Solo admin
 */

import type { CollectionConfig, Access } from 'payload';

const isAdmin: Access = ({ req: { user } }) => {
    if (!user) return false;
    return (user as any).role === 'admin';
};

export const ContactMessages: CollectionConfig = {
    slug: 'contact-messages',
    labels: {
        singular: 'Mensaje de Contacto',
        plural: 'Mensajes de Contacto',
    },
    admin: {
        useAsTitle: 'email',
        defaultColumns: ['nombre', 'email', 'asunto', 'createdAt'],
        group: 'Contacto',
    },
    access: {
        read: isAdmin,
        create: () => true, // Permitir a cualquiera (público)
        update: isAdmin,
        delete: isAdmin,
    },
    fields: [
        {
            name: 'nombre',
            type: 'text',
            required: true,
            label: 'Nombre',
        },
        {
            name: 'email',
            type: 'email',
            required: true,
            label: 'Correo Electrónico',
        },
        {
            name: 'telefono',
            type: 'text',
            label: 'Teléfono',
        },
        {
            name: 'asunto',
            type: 'text',
            required: true,
            label: 'Asunto',
        },
        {
            name: 'mensaje',
            type: 'textarea',
            required: true,
            label: 'Mensaje',
        },
        {
            name: 'estado',
            type: 'select',
            options: [
                { label: 'Nuevo', value: 'nuevo' },
                { label: 'Leído', value: 'leido' },
                { label: 'En Progreso', value: 'progreso' },
                { label: 'Resuelto', value: 'resuelto' },
            ],
            defaultValue: 'nuevo',
            label: 'Estado',
            admin: {
                description: 'Estado del mensaje de contacto',
            },
        },
        {
            name: 'respuesta',
            type: 'textarea',
            label: 'Respuesta del Admin',
            admin: {
                description: 'Respuesta enviada al usuario (solo para admin)',
            },
        },
        {
            name: 'fechaRespuesta',
            type: 'date',
            label: 'Fecha de Respuesta',
            admin: {
                readOnly: true,
            },
        },
    ],
};
