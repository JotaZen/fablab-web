
import type { GlobalConfig } from 'payload';

export const EquipoPage: GlobalConfig = {
    slug: 'equipo-page',
    label: 'Página Equipo',
    admin: {
        group: 'Páginas',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'heroStats',
            type: 'array',
            label: 'Estadísticas del Hero',
            minRows: 1,
            maxRows: 4,
            fields: [
                {
                    name: 'text',
                    type: 'text',
                    label: 'Texto (ej: "8 Expertos")',
                    required: true,
                },
                {
                    name: 'icon',
                    type: 'select',
                    label: 'Icono',
                    options: [
                        { label: 'Copa (Award)', value: 'award' },
                        { label: 'Usuarios (Users)', value: 'users' },
                        { label: 'Brillos (Sparkles)', value: 'sparkles' },
                        { label: 'Calendario (Calendar)', value: 'calendar' },
                        { label: 'Rocket', value: 'rocket' },
                    ],
                    defaultValue: 'users',
                },
            ],
        },
        {
            name: 'heroTitle',
            type: 'text',
            label: 'Título Hero',
            defaultValue: 'Las personas detrás de FabLab',
        },
        {
            name: 'heroDescription',
            type: 'textarea',
            label: 'Descripción Hero',
        }
    ],
};
