// Tipos para Events - basados en schema de Payload

export interface EventData {
    id: string;
    title: string;
    slug: string;
    type?: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: string;
    isOnline: boolean;
    capacity?: number;
    featured: boolean;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
}

export const STATUS_LABELS: Record<string, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    cancelled: 'Cancelado',
    completed: 'Completado',
};
