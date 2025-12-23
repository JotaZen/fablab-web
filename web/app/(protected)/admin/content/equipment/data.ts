// Tipos para Equipment - basados en schema de Payload

export interface EquipmentData {
    id: string;
    name: string;
    slug: string;
    category?: string;
    brand?: string;
    model?: string;
    description: string;
    featuredImage?: string;
    status: 'available' | 'maintenance' | 'out-of-service';
    location?: string;
    requiresTraining: boolean;
    order: number;
}

export const STATUS_LABELS: Record<string, string> = {
    available: 'Disponible',
    maintenance: 'En Mantenimiento',
    'out-of-service': 'Fuera de Servicio',
};
