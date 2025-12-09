/**
 * Vessel Reservation Client
 * 
 * Adaptador para reservas usando la API nativa de reservaciones de Vessel.
 * Actualizado para usar los endpoints dedicate: /api/v1/stock/reservations/*
 */

import { VesselBaseClient, type ApiListResponse } from './base.client';
import type {
    Reserva,
    CrearReservaDTO,
    LiberarReservaDTO,
    FiltrosReserva,
    ResumenReservas,
} from '../../domain/entities/reservation';
import type { ReservationPort } from '../../domain/ports/reservation.port';

interface ApiReservation {
    id: string;
    item_id: string;
    location_id: string;
    quantity: number;
    reserved_by: string;
    reference_type: string;
    reference_id: string;
    status: string;
    expires_at: string | null;
    created_at: string | null;
    released_at: string | null;
}

export class ReservationClient extends VesselBaseClient implements ReservationPort {

    async listar(filtros?: FiltrosReserva): Promise<{ data: Reserva[]; total: number }> {
        const params: Record<string, any> = {};

        // Mapeo filtros
        // Mapeo filtros
        if (filtros?.stockItemId) params.item_id = filtros.stockItemId;
        if (filtros?.ubicacionId) params.location_id = filtros.ubicacionId;
        if (filtros?.estado) {
            const rawStatus = Array.isArray(filtros.estado) ? filtros.estado[0] : filtros.estado;
            // Map Spanish -> English
            const map: Record<string, string> = {
                'pendiente': 'pending',
                'activa': 'active',
                'liberada': 'released',
                'rechazada': 'rejected',
                'expirada': 'expired',
                'consumida': 'consumed',
                'cancelada': 'cancelled',
            };
            params.status = map[rawStatus] || rawStatus;
        }

        const response = await this.get<{ data: ApiReservation[], total: number }>(
            '/api/v1/stock/reservations',
            { params }
        );

        return {
            data: response.data.map(this.mapApiToReserva),
            total: response.total,
        };
    }

    async obtener(id: string): Promise<Reserva | null> {
        return null;
    }

    async crear(dto: CrearReservaDTO): Promise<Reserva> {
        const status = dto.estado || 'pending';
        const payload: Record<string, any> = {
            item_id: dto.stockItemId,
            quantity: dto.cantidad,
            reserved_by: dto.reservadoPor,
            status: status,
        };

        // Solo buscar ubicación si NO es pending (la ubicación se elige al aprobar)
        if (status !== 'pending') {
            const stockItem = await this.get<any>(`/api/v1/stock/items/show/${dto.stockItemId}`);
            payload.location_id = stockItem.location_id;
        }

        const response = await this.post<any>('/api/v1/stock/reservations/reserve', payload);

        return {
            id: response.reservation_id,
            stockItemId: payload.item_id,
            ubicacionId: payload.location_id || '',
            cantidad: payload.quantity,
            reservadoPor: payload.reserved_by,
            estado: status as any,
            fechaReserva: new Date().toISOString(),
        } as Reserva;
    }

    async liberar(dto: LiberarReservaDTO): Promise<Reserva> {
        await this.post('/api/v1/stock/reservations/release', {
            reservation_id: dto.reservaId,
            quantity: dto.cantidad
        });
        return { id: dto.reservaId } as Reserva;
    }

    async cancelar(id: string, motivo?: string): Promise<void> {
        // Backend doesn't support reason for cancellation yet in DELETE endpoint, 
        // or we could pass it in query/body if method wasn't DELETE.
        // But Controller destroy() logic in step 744: releases logic with "Reserva cancelada manualmente".
        // It doesn't take reason from request.
        // Use default reason or update backend later.
        await this.delete(`/api/v1/stock/reservations/${id}`);
    }

    async aprobar(id: string): Promise<void> {
        await this.post(`/api/v1/stock/reservations/${id}/approve`, {});
    }

    async rechazar(id: string, reason?: string): Promise<void> {
        await this.post(`/api/v1/stock/reservations/${id}/reject`, { reason });
    }

    // Helper
    private mapApiToReserva(api: ApiReservation): Reserva {
        const statusMap: Record<string, string> = {
            'pending': 'pendiente',
            'active': 'activa',
            'released': 'liberada',
            'rejected': 'rechazada',
            'expired': 'expirada',
            'consumed': 'consumida',
            'cancelled': 'cancelada'
        };

        return {
            id: api.id,
            stockItemId: api.item_id,
            itemNombre: (api as any).item_name || 'Item Desconocido',
            ubicacionId: api.location_id,
            cantidad: Number(api.quantity),
            reservadoPor: api.reserved_by,
            estado: (statusMap[api.status] || api.status) as any,
            fechaReserva: api.created_at || '',
            fechaExpiracion: api.expires_at || undefined,
            fechaLiberacion: api.released_at || undefined,
            tipoReferencia: (api.reference_type as any) || undefined,
            referenciaId: api.reference_id,
        };
    }

    async consumir(id: string): Promise<void> { throw new Error("Not implemented in backend yet"); }
    async obtenerResumen(id: string): Promise<ResumenReservas> { return {} as any; }
    async obtenerPorUsuario(id: string): Promise<Reserva[]> { return []; }
}

// === SINGLETON ===

let _instance: ReservationClient | null = null;

export function getReservationClient(): ReservationClient {
    if (!_instance) {
        _instance = new ReservationClient();
    }
    return _instance;
}

export function resetReservationClient(): void {
    _instance = null;
}
