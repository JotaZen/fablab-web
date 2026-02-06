// Tipos para la gestión de Equipos e Inventario

// ── Equipos (público en /tecnologías) ──

export interface EquipmentSpecification {
    label: string;
    value: string;
}

export interface EquipmentData {
    id: string;
    name: string;
    slug: string;
    category: string;
    brand: string;
    model: string;
    description: string;
    featuredImage: string | null;
    gallery: { id: string; url: string }[];
    specifications: EquipmentSpecification[];
    materials: string[];
    status: 'available' | 'maintenance' | 'out-of-service';
    location: string;
    requiresTraining: boolean;
    showInTecnologias: boolean;
    order: number;
    activeUsages: number;
}

// ── Inventario (solo admin) ──

export interface InventoryItemData {
    id: string;
    name: string;
    sku: string;
    category: string;
    description: string;
    image: string | null;
    quantity: number;
    unit: string;
    minimumStock: number;
    location: string;
    supplier: string;
    unitCost: number | null;
    status: 'available' | 'low-stock' | 'out-of-stock';
    notes: string;
    updatedAt: string;
}

// ── Usos de Equipos ──

export interface EquipmentUsageData {
    id: string;
    equipmentId: string;
    equipmentName: string;
    userId: string;
    userName: string;
    startTime: string;
    endTime: string | null;
    estimatedDuration: string;
    description: string;
    status: 'active' | 'completed';
}

// ── Constantes de categoría ──

export const EQUIPMENT_CATEGORIES: Record<string, string> = {
    '3d-printer': 'Impresora 3D',
    'laser-cutter': 'Cortadora Láser',
    'cnc': 'CNC',
    'electronics': 'Electrónica',
    'hand-tools': 'Herramientas Manuales',
    'power-tools': 'Herramientas Eléctricas',
    '3d-scanner': 'Escáner 3D',
    'computing': 'Computación',
    'other': 'Otro',
};

export const INVENTORY_CATEGORIES: Record<string, string> = {
    'consumable': 'Consumible',
    'material': 'Material',
    'component': 'Componente Electrónico',
    'tool': 'Herramienta',
    'supply': 'Insumo General',
    'furniture': 'Mueble',
    'room': 'Sala / Espacio',
    'other': 'Otro',
};

export const INVENTORY_UNITS: Record<string, string> = {
    'unit': 'Unidad(es)',
    'kg': 'Kilogramos',
    'g': 'Gramos',
    'm': 'Metros',
    'cm': 'Centímetros',
    'l': 'Litros',
    'ml': 'Mililitros',
    'roll': 'Rollos',
    'sheet': 'Hojas',
    'pack': 'Paquetes',
};

export const EQUIPMENT_STATUS: Record<string, string> = {
    'available': 'Disponible',
    'maintenance': 'En Mantenimiento',
    'out-of-service': 'Fuera de Servicio',
};

export const INVENTORY_STATUS: Record<string, string> = {
    'available': 'Disponible',
    'low-stock': 'Stock Bajo',
    'out-of-stock': 'Agotado',
};
