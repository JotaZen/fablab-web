/**
 * Location Capacity Client
 * 
 * Cliente para API de configuración de capacidad de ubicaciones
 */

import { VesselBaseClient } from './base.client';
import type {
    ConfiguracionCapacidad,
    CrearConfiguracionDTO,
    EstadisticasCapacidad,
    CapacidadDisponible,
    ValidacionCapacidad,
} from '../../domain/entities/location-capacity';

interface ApiCapacityConfig {
    id: string;
    location_id: string;
    max_quantity?: number | null;
    max_weight?: number | null;
    max_volume?: number | null;
    allowed_item_types?: string[] | null;
    allow_mixed_lots: boolean;
    allow_mixed_skus: boolean;
    allow_negative_stock: boolean;
    max_reservation_percentage?: number | null;
    fifo_enforced: boolean;
    is_active: boolean;
    workspace_id?: string | null;
    meta?: Record<string, any> | null;
}

interface ApiCapacityStats {
    location_id: string;
    current_quantity: number;
    max_quantity?: number | null;
    available_quantity?: number | null;
    usage_percent?: number | null;
    unique_items: number;
    allow_mixed_items: boolean;
    fifo_enforced: boolean;
    is_active: boolean;
}

interface ApiAvailable {
    location_id: string;
    available_capacity?: number | null;
    has_limit: boolean;
}

interface ApiValidation {
    valid: boolean;
    error?: string;
    message?: string;
    location_id: string;
    details?: {
        current_quantity?: number;
        requested_quantity?: number;
        max_quantity?: number;
        available?: number;
    };
}

// Mappers
function apiToConfig(api: ApiCapacityConfig): ConfiguracionCapacidad {
    return {
        id: api.id,
        locationId: api.location_id,
        maxQuantity: api.max_quantity,
        maxWeight: api.max_weight,
        maxVolume: api.max_volume,
        allowedItemTypes: api.allowed_item_types,
        allowMixedLots: api.allow_mixed_lots,
        allowMixedSkus: api.allow_mixed_skus,
        allowNegativeStock: api.allow_negative_stock ?? false,
        maxReservationPercentage: api.max_reservation_percentage,
        fifoEnforced: api.fifo_enforced,
        isActive: api.is_active,
        workspaceId: api.workspace_id,
        meta: api.meta,
        // Extraer de meta
        minQuantity: api.meta?.min_quantity ?? null,
        allowReservations: api.meta?.allow_reservations ?? true,
    };
}

function apiToStats(api: ApiCapacityStats): EstadisticasCapacidad {
    return {
        locationId: api.location_id,
        currentQuantity: api.current_quantity,
        maxQuantity: api.max_quantity,
        availableQuantity: api.available_quantity,
        usagePercent: api.usage_percent,
        uniqueItems: api.unique_items,
        allowMixedItems: api.allow_mixed_items,
        fifoEnforced: api.fifo_enforced,
        isActive: api.is_active,
    };
}

function apiToAvailable(api: ApiAvailable): CapacidadDisponible {
    return {
        locationId: api.location_id,
        availableCapacity: api.available_capacity,
        hasLimit: api.has_limit,
    };
}

function apiToValidation(api: ApiValidation): ValidacionCapacidad {
    return {
        valid: api.valid,
        error: api.error,
        message: api.message,
        locationId: api.location_id,
        details: api.details ? {
            currentQuantity: api.details.current_quantity,
            requestedQuantity: api.details.requested_quantity,
            maxQuantity: api.details.max_quantity,
            available: api.details.available,
        } : undefined,
    };
}

export class LocationCapacityClient extends VesselBaseClient {

    /**
     * Obtener configuración de capacidad de una ubicación
     */
    async obtener(locationId: string): Promise<ConfiguracionCapacidad | null> {
        try {
            const response = await this.get<{ data: ApiCapacityConfig | null }>(`/api/v1/stock/capacity/${locationId}`);
            if (response.data) {
                return apiToConfig(response.data);
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Crear o actualizar configuración
     */
    async guardar(dto: CrearConfiguracionDTO): Promise<ConfiguracionCapacidad> {
        // Construir meta con campos dinámicos
        const meta: Record<string, any> = {};
        if (dto.minQuantity !== undefined && dto.minQuantity !== null) {
            meta.min_quantity = dto.minQuantity;
        }
        if (dto.allowReservations !== undefined) {
            meta.allow_reservations = dto.allowReservations;
        }

        const body = {
            location_id: dto.locationId,
            max_quantity: dto.maxQuantity,
            max_weight: dto.maxWeight,
            max_volume: dto.maxVolume,
            allowed_item_types: dto.allowedItemTypes,
            allow_mixed_lots: dto.allowMixedLots,
            allow_mixed_skus: dto.allowMixedSkus,
            allow_negative_stock: dto.allowNegativeStock,
            max_reservation_percentage: dto.maxReservationPercentage,
            fifo_enforced: dto.fifoEnforced,
            is_active: dto.isActive,
            meta: Object.keys(meta).length > 0 ? meta : null,
        };

        const response = await this.post<{ data: ApiCapacityConfig }>('/api/v1/stock/capacity', body);
        return apiToConfig(response.data);
    }

    /**
     * Eliminar configuración (volver a sin límites)
     */
    async eliminar(locationId: string): Promise<void> {
        await this.delete(`/api/v1/stock/capacity/${locationId}`);
    }

    /**
     * Obtener estadísticas de capacidad
     */
    async obtenerEstadisticas(locationId: string): Promise<EstadisticasCapacidad | null> {
        try {
            const response = await this.get<{ data: ApiCapacityStats }>(`/api/v1/stock/capacity/${locationId}/stats`);
            return apiToStats(response.data);
        } catch {
            return null;
        }
    }

    /**
     * Obtener capacidad disponible
     */
    async obtenerDisponible(locationId: string): Promise<CapacidadDisponible | null> {
        try {
            const response = await this.get<{ data: ApiAvailable }>(`/api/v1/stock/capacity/${locationId}/available`);
            return apiToAvailable(response.data);
        } catch {
            return null;
        }
    }

    /**
     * Verificar si puede recibir stock
     */
    async puedeRecibir(locationId: string, itemId: string, quantity: number): Promise<ValidacionCapacidad> {
        const response = await this.get<ApiValidation>(
            `/api/v1/stock/capacity/${locationId}/can-accept?item_id=${itemId}&quantity=${quantity}`
        );
        return apiToValidation(response);
    }

    /**
     * Verificar si está llena
     */
    async estaLlena(locationId: string): Promise<boolean> {
        try {
            const response = await this.get<{ data: { is_full: boolean } }>(`/api/v1/stock/capacity/${locationId}/is-full`);
            return response.data.is_full;
        } catch {
            return false;
        }
    }

    /**
     * Obtener stock total (incluyendo hijos)
     */
    async obtenerStockTotal(locationId: string): Promise<number> {
        try {
            const response = await this.get<{ data: { total_quantity: number } }>(`/api/v1/stock/capacity/${locationId}/total-stock`);
            return response.data.total_quantity;
        } catch {
            return 0;
        }
    }
}

// Singleton
let _instance: LocationCapacityClient | null = null;

export function getLocationCapacityClient(): LocationCapacityClient {
    if (!_instance) {
        _instance = new LocationCapacityClient();
    }
    return _instance;
}
