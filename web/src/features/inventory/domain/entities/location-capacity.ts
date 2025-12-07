/**
 * Location Capacity / Settings
 * 
 * Configuración de capacidad y restricciones para ubicaciones
 */

export interface ConfiguracionCapacidad {
    id: string;
    locationId: string;
    maxQuantity?: number | null;
    maxWeight?: number | null;
    maxVolume?: number | null;
    allowedItemTypes?: string[] | null;
    allowMixedLots: boolean;
    allowMixedSkus: boolean;
    fifoEnforced: boolean;
    isActive: boolean;
    workspaceId?: string | null;
    meta?: Record<string, any> | null;
}

export interface CrearConfiguracionDTO {
    locationId: string;
    maxQuantity?: number | null;
    maxWeight?: number | null;
    maxVolume?: number | null;
    allowedItemTypes?: string[] | null;
    allowMixedLots?: boolean;
    allowMixedSkus?: boolean;
    fifoEnforced?: boolean;
    isActive?: boolean;
}

export interface EstadisticasCapacidad {
    locationId: string;
    currentQuantity: number;
    maxQuantity?: number | null;
    availableQuantity?: number | null;
    usagePercent?: number | null;
    uniqueItems: number;
    allowMixedItems: boolean;
    fifoEnforced: boolean;
    isActive: boolean;
}

export interface CapacidadDisponible {
    locationId: string;
    availableCapacity?: number | null;
    hasLimit: boolean;
}

export interface ValidacionCapacidad {
    valid: boolean;
    error?: string;
    message?: string;
    locationId: string;
    details?: {
        currentQuantity?: number;
        requestedQuantity?: number;
        maxQuantity?: number;
        available?: number;
    };
}
