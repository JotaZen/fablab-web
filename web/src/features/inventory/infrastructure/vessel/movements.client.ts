/**
 * Movements Client
 * 
 * Cliente para API de movimientos de inventario (Kardex)
 */

import { VesselBaseClient } from './base.client';
import type {
    Movimiento,
    CrearMovimientoDTO,
    TransferirDTO,
    AjustarDTO,
    FiltrosMovimiento,
    TipoMovimiento,
    EstadoMovimiento,
} from '../../domain/entities/movement';

interface ApiMovement {
    id: string;
    type: string;
    status: string;
    item_id: string;
    location_id: string;
    quantity: number;
    lot_id?: string;
    tracked_unit_id?: string;
    source_location_id?: string;
    destination_location_id?: string;
    source_type?: string;
    source_id?: string;
    reference_type?: string;
    reference_id?: string;
    reason?: string;
    performed_by?: string;
    workspace_id?: string;
    meta?: Record<string, any>;
    created_at: string;
    processed_at?: string;
}

interface ApiPaginatedResponse<T> {
    data: T[];
    meta?: {
        total: number;
        limit: number;
        offset: number;
    };
}

function apiToMovimiento(api: ApiMovement): Movimiento {
    return {
        id: api.id,
        type: api.type as TipoMovimiento,
        status: api.status as EstadoMovimiento,
        itemId: api.item_id,
        locationId: api.location_id,
        quantity: api.quantity,
        lotId: api.lot_id,
        trackedUnitId: api.tracked_unit_id,
        sourceLocationId: api.source_location_id,
        destinationLocationId: api.destination_location_id,
        sourceType: api.source_type,
        sourceId: api.source_id,
        referenceType: api.reference_type,
        referenceId: api.reference_id,
        reason: api.reason,
        performedBy: api.performed_by,
        workspaceId: api.workspace_id,
        meta: api.meta,
        createdAt: api.created_at,
        processedAt: api.processed_at,
    };
}

export class MovementsClient extends VesselBaseClient {

    /**
     * Listar movimientos con filtros
     */
    async listar(filtros?: FiltrosMovimiento): Promise<{ data: Movimiento[]; total: number }> {
        const params = new URLSearchParams();

        if (filtros?.itemId) params.append('item_id', filtros.itemId);
        if (filtros?.locationId) params.append('location_id', filtros.locationId);
        if (filtros?.type) params.append('type', filtros.type);
        if (filtros?.status) params.append('status', filtros.status);
        if (filtros?.desde) params.append('from', filtros.desde);
        if (filtros?.hasta) params.append('to', filtros.hasta);
        if (filtros?.referenceType) params.append('reference_type', filtros.referenceType);
        if (filtros?.referenceId) params.append('reference_id', filtros.referenceId);
        if (filtros?.limit) params.append('limit', filtros.limit.toString());
        if (filtros?.offset) params.append('offset', filtros.offset.toString());

        const query = params.toString();
        const url = `/api/v1/stock/movements${query ? `?${query}` : ''}`;

        const response = await this.get<ApiPaginatedResponse<ApiMovement>>(url);

        return {
            data: response.data.map(apiToMovimiento),
            total: response.meta?.total || response.data.length,
        };
    }

    /**
     * Obtener un movimiento por ID
     */
    async obtener(id: string): Promise<Movimiento | null> {
        try {
            const response = await this.get<{ data: ApiMovement }>(`/api/v1/stock/movements/${id}`);
            return apiToMovimiento(response.data);
        } catch {
            return null;
        }
    }

    /**
     * Crear movimiento genérico
     */
    async crear(dto: CrearMovimientoDTO): Promise<Movimiento> {
        const body = {
            type: dto.type,
            item_id: dto.itemId,
            location_id: dto.locationId,
            quantity: dto.quantity,
            lot_id: dto.lotId,
            source_type: dto.sourceType,
            source_id: dto.sourceId,
            reference_type: dto.referenceType,
            reference_id: dto.referenceId,
            reason: dto.reason,
        };

        const response = await this.post<{ data: ApiMovement }>('/api/v1/stock/movements', body);
        return apiToMovimiento(response.data);
    }

    // === HELPERS ===

    /**
     * Registrar recepción de stock
     */
    async recepcion(itemId: string, locationId: string, quantity: number, referenceId?: string): Promise<Movimiento> {
        const body = {
            item_id: itemId,
            location_id: locationId,
            quantity,
            reference_id: referenceId,
        };

        const response = await this.post<{ data: ApiMovement }>('/api/v1/stock/movements/receipt', body);
        return apiToMovimiento(response.data);
    }

    /**
     * Registrar envío/salida
     */
    async envio(itemId: string, locationId: string, quantity: number, referenceId?: string): Promise<Movimiento> {
        const body = {
            item_id: itemId,
            location_id: locationId,
            quantity,
            reference_id: referenceId,
        };

        const response = await this.post<{ data: ApiMovement }>('/api/v1/stock/movements/shipment', body);
        return apiToMovimiento(response.data);
    }

    /**
     * Transferir entre ubicaciones
     */
    async transferir(dto: TransferirDTO): Promise<Movimiento> {
        const body = {
            item_id: dto.itemId,
            source_location_id: dto.sourceLocationId,
            destination_location_id: dto.destinationLocationId,
            quantity: dto.quantity,
            reference_type: dto.referenceType,
            reference_id: dto.referenceId,
        };

        const response = await this.post<{ data: ApiMovement }>('/api/v1/stock/movements/transfer', body);
        return apiToMovimiento(response.data);
    }

    /**
     * Ajuste de inventario
     */
    async ajuste(dto: AjustarDTO): Promise<Movimiento> {
        const body = {
            item_id: dto.itemId,
            location_id: dto.locationId,
            quantity: dto.quantity,
            reason: dto.reason,
        };

        const response = await this.post<{ data: ApiMovement }>('/api/v1/stock/movements/adjustment', body);
        return apiToMovimiento(response.data);
    }

    /**
     * Consumo interno
     */
    async consumo(itemId: string, locationId: string, quantity: number, reason?: string): Promise<Movimiento> {
        return this.crear({
            type: 'consumption',
            itemId,
            locationId,
            quantity,
            reason,
        });
    }

    /**
     * Obtener historial de un item
     */
    async historialItem(itemId: string, limit = 50): Promise<Movimiento[]> {
        const result = await this.listar({ itemId, limit });
        return result.data;
    }

    /**
     * Obtener historial de una ubicación
     */
    async historialUbicacion(locationId: string, limit = 50): Promise<Movimiento[]> {
        const result = await this.listar({ locationId, limit });
        return result.data;
    }
}

// Singleton
let _instance: MovementsClient | null = null;

export function getMovementsClient(): MovementsClient {
    if (!_instance) {
        _instance = new MovementsClient();
    }
    return _instance;
}
