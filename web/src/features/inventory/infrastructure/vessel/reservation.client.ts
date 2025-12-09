/**
 * Vessel Reservation Client
 * 
 * Adaptador para reservas usando Vessel API.
 * 
 * ESTRATEGIA: Vessel API solo tiene `reserved_quantity` como número simple.
 * Para información adicional (quién, hasta cuándo, para qué), usamos:
 * 
 * 1. El endpoint `/v1/stock/items/reserve/{id}` para el número
 * 2. El campo `meta.reservations[]` del stock item para el detalle
 * 3. Movimientos de tipo `reserve` y `release` para historial
 * 
 * Esto permite mantener compatibilidad con Vessel mientras agregamos
 * funcionalidad rica de reservas.
 */

import { VesselBaseClient, type ApiListResponse } from './base.client';
import type {
    Reserva,
    CrearReservaDTO,
    LiberarReservaDTO,
    FiltrosReserva,
    ResumenReservas,
    EstadoReserva,
} from '../../domain/entities/reservation';
import type { ReservationPort } from '../../domain/ports/reservation.port';
import type { ApiStockItem } from './vessel.types';
import { apiToItemStock } from './vessel.mappers';

/** Estructura de reserva dentro de meta del stock item */
interface MetaReservation {
    id: string;
    cantidad: number;
    reservadoPor: string;
    reservadoPorNombre?: string;
    tipoReferencia?: string;
    referenciaId?: string;
    referenciaNombre?: string;
    fechaReserva: string;
    fechaExpiracion?: string;
    fechaLiberacion?: string;
    estado: EstadoReserva;
    notas?: string;
}

/** Genera un ID único para reserva */
function generateReservationId(): string {
    return `res-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export class ReservationClient extends VesselBaseClient implements ReservationPort {

    /**
     * Listar reservas
     * Busca en todos los stock items que tengan reservas en meta
     */
    async listar(filtros?: FiltrosReserva): Promise<{ data: Reserva[]; total: number }> {
        // Obtener stock items con reservas
        const params: Record<string, string | undefined> = {};
        if (filtros?.ubicacionId) params.location_id = filtros.ubicacionId;
        if (filtros?.catalogoItemId) params.catalog_item_id = filtros.catalogoItemId;
        if (filtros?.limite) params.limit = filtros.limite.toString();
        if (filtros?.offset) params.offset = filtros.offset.toString();

        const response = await this.get<ApiListResponse<ApiStockItem> | ApiStockItem[]>(
            '/api/v1/stock/items/read',
            { params }
        );

        const items = Array.isArray(response) ? response : response.data;
        const reservas: Reserva[] = [];

        // Extraer reservas de cada stock item
        for (const item of items) {
            const metaReservations = (item.meta?.reservations as MetaReservation[]) || [];

            for (const mr of metaReservations) {
                // Aplicar filtros
                if (filtros?.reservadoPor && mr.reservadoPor !== filtros.reservadoPor) continue;
                if (filtros?.referenciaId && mr.referenciaId !== filtros.referenciaId) continue;
                if (filtros?.soloActivas && mr.estado !== 'activa') continue;
                if (filtros?.estado) {
                    const estados = Array.isArray(filtros.estado) ? filtros.estado : [filtros.estado];
                    if (!estados.includes(mr.estado)) continue;
                }

                reservas.push(this.metaToReserva(mr, item));
            }
        }

        return {
            data: reservas,
            total: reservas.length,
        };
    }

    /**
     * Obtener una reserva por ID
     */
    async obtener(id: string): Promise<Reserva | null> {
        // Buscar en todos los stock items (ineficiente, pero funcional)
        const { data } = await this.listar();
        return data.find(r => r.id === id) || null;
    }

    /**
     * Crear una nueva reserva
     */
    async crear(dto: CrearReservaDTO): Promise<Reserva> {
        // 1. Obtener el stock item actual
        const stockItem = await this.get<ApiStockItem>(`/api/v1/stock/items/show/${dto.stockItemId}`);

        // 2. Verificar disponibilidad
        const disponible = stockItem.quantity - stockItem.reserved_quantity;
        if (dto.cantidad > disponible) {
            throw new Error(`Stock insuficiente. Disponible: ${disponible}`);
        }

        // 3. Reservar en Vessel API (incrementa reserved_quantity)
        await this.post(`/api/v1/stock/items/reserve/${dto.stockItemId}`, {
            quantity: dto.cantidad,
        });

        // 4. Agregar detalle de reserva en meta
        const metaReservations = (stockItem.meta?.reservations as MetaReservation[]) || [];
        const newReservation: MetaReservation = {
            id: generateReservationId(),
            cantidad: dto.cantidad,
            reservadoPor: dto.reservadoPor,
            reservadoPorNombre: dto.reservadoPorNombre,
            tipoReferencia: dto.tipoReferencia,
            referenciaId: dto.referenciaId,
            referenciaNombre: dto.referenciaNombre,
            fechaReserva: new Date().toISOString(),
            fechaExpiracion: dto.fechaExpiracion,
            estado: 'activa',
            notas: dto.notas,
        };

        metaReservations.push(newReservation);

        // 5. Actualizar meta del stock item
        await this.put(`/api/v1/stock/items/update/${dto.stockItemId}`, {
            meta: {
                ...stockItem.meta,
                reservations: metaReservations,
            },
        });

        // 6. Retornar la reserva creada
        return {
            id: newReservation.id,
            stockItemId: dto.stockItemId,
            catalogoItemId: stockItem.catalog_item_id,
            ubicacionId: stockItem.location_id,
            cantidad: dto.cantidad,
            reservadoPor: dto.reservadoPor,
            reservadoPorNombre: dto.reservadoPorNombre,
            tipoReferencia: dto.tipoReferencia,
            referenciaId: dto.referenciaId,
            referenciaNombre: dto.referenciaNombre,
            fechaReserva: newReservation.fechaReserva,
            fechaExpiracion: dto.fechaExpiracion,
            estado: 'activa',
            notas: dto.notas,
            createdAt: newReservation.fechaReserva,
        };
    }

    /**
     * Liberar una reserva
     */
    async liberar(dto: LiberarReservaDTO): Promise<Reserva> {
        // 1. Buscar la reserva y su stock item
        const { data } = await this.listar();
        const reserva = data.find(r => r.id === dto.reservaId);

        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }

        const cantidadLiberar = dto.cantidad || reserva.cantidad;

        // 2. Liberar en Vessel API (decrementa reserved_quantity)
        await this.post(`/api/v1/stock/items/release/${reserva.stockItemId}`, {
            quantity: cantidadLiberar,
        });

        // 3. Actualizar en meta
        const stockItem = await this.get<ApiStockItem>(`/api/v1/stock/items/show/${reserva.stockItemId}`);
        const metaReservations = (stockItem.meta?.reservations as MetaReservation[]) || [];
        const idx = metaReservations.findIndex(r => r.id === dto.reservaId);

        if (idx !== -1) {
            if (cantidadLiberar >= metaReservations[idx].cantidad) {
                // Liberación total
                metaReservations[idx].estado = 'liberada';
                metaReservations[idx].fechaLiberacion = new Date().toISOString();
            } else {
                // Liberación parcial
                metaReservations[idx].cantidad -= cantidadLiberar;
            }

            await this.put(`/api/v1/stock/items/update/${reserva.stockItemId}`, {
                meta: {
                    ...stockItem.meta,
                    reservations: metaReservations,
                },
            });
        }

        return {
            ...reserva,
            estado: cantidadLiberar >= reserva.cantidad ? 'liberada' : 'activa',
            cantidad: reserva.cantidad - cantidadLiberar,
            fechaLiberacion: new Date().toISOString(),
        };
    }

    /**
     * Cancelar una reserva
     */
    async cancelar(id: string, motivo?: string): Promise<void> {
        await this.liberar({ reservaId: id, motivo });
    }

    /**
     * Consumir reserva (convertir en salida de stock)
     */
    async consumir(id: string): Promise<void> {
        const reserva = await this.obtener(id);
        if (!reserva) throw new Error('Reserva no encontrada');

        // Liberar la reserva
        await this.post(`/api/v1/stock/items/release/${reserva.stockItemId}`, {
            quantity: reserva.cantidad,
        });

        // Marcar como consumida en meta
        const stockItem = await this.get<ApiStockItem>(`/api/v1/stock/items/show/${reserva.stockItemId}`);
        const metaReservations = (stockItem.meta?.reservations as MetaReservation[]) || [];
        const idx = metaReservations.findIndex(r => r.id === id);

        if (idx !== -1) {
            metaReservations[idx].estado = 'consumida';
            metaReservations[idx].fechaLiberacion = new Date().toISOString();

            await this.put(`/api/v1/stock/items/update/${reserva.stockItemId}`, {
                meta: {
                    ...stockItem.meta,
                    reservations: metaReservations,
                },
            });
        }
    }

    /**
     * Obtener resumen de reservas para un stock item
     */
    async obtenerResumen(stockItemId: string): Promise<ResumenReservas> {
        const stockItem = await this.get<ApiStockItem>(`/api/v1/stock/items/show/${stockItemId}`);
        const metaReservations = (stockItem.meta?.reservations as MetaReservation[]) || [];

        const activas = metaReservations.filter(r => r.estado === 'activa');
        const expiraciones = activas
            .filter(r => r.fechaExpiracion)
            .map(r => r.fechaExpiracion!)
            .sort();

        return {
            totalReservas: metaReservations.length,
            cantidadTotalReservada: stockItem.reserved_quantity,
            reservasActivas: activas.length,
            proximaExpiracion: expiraciones[0],
        };
    }

    /**
     * Obtener reservas activas de un usuario
     */
    async obtenerPorUsuario(usuarioId: string): Promise<Reserva[]> {
        const { data } = await this.listar({
            reservadoPor: usuarioId,
            soloActivas: true,
        });
        return data;
    }

    /**
     * Convertir MetaReservation a Reserva
     */
    private metaToReserva(mr: MetaReservation, stockItem: ApiStockItem): Reserva {
        return {
            id: mr.id,
            stockItemId: stockItem.id,
            catalogoItemId: stockItem.catalog_item_id,
            ubicacionId: stockItem.location_id,
            cantidad: mr.cantidad,
            reservadoPor: mr.reservadoPor,
            reservadoPorNombre: mr.reservadoPorNombre,
            tipoReferencia: mr.tipoReferencia as Reserva['tipoReferencia'],
            referenciaId: mr.referenciaId,
            referenciaNombre: mr.referenciaNombre,
            fechaReserva: mr.fechaReserva,
            fechaExpiracion: mr.fechaExpiracion,
            fechaLiberacion: mr.fechaLiberacion,
            estado: mr.estado,
            notas: mr.notas,
            createdAt: mr.fechaReserva,
        };
    }
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
