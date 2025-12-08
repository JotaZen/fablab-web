/**
 * Hook useReservations
 * 
 * Hook para gestionar reservas de stock.
 */

"use client";

import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/shared/ui/feedback/toast-provider';
import { getReservationClient } from '../../infrastructure/vessel/reservation.client';
import type {
    Reserva,
    CrearReservaDTO,
    LiberarReservaDTO,
    FiltrosReserva,
    ResumenReservas,
} from '../../domain/entities/reservation';

interface UseReservationsState {
    reservas: Reserva[];
    cargando: boolean;
    total: number;
}

interface UseReservationsActions {
    cargar: (filtros?: FiltrosReserva) => Promise<void>;
    crear: (dto: CrearReservaDTO) => Promise<Reserva>;
    liberar: (dto: LiberarReservaDTO) => Promise<Reserva>;
    cancelar: (id: string, motivo?: string) => Promise<void>;
    consumir: (id: string) => Promise<void>;
    obtenerResumen: (stockItemId: string) => Promise<ResumenReservas>;
    refrescar: () => Promise<void>;
}

export type UseReservationsResult = UseReservationsState & UseReservationsActions;

export function useReservations(filtrosIniciales?: FiltrosReserva): UseReservationsResult {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [cargando, setCargando] = useState(false);
    const [total, setTotal] = useState(0);
    const [ultimosFiltros, setUltimosFiltros] = useState<FiltrosReserva | undefined>(filtrosIniciales);

    const toast = useToast();
    const client = useMemo(() => getReservationClient(), []);

    const cargar = useCallback(async (filtros?: FiltrosReserva) => {
        setCargando(true);
        setUltimosFiltros(filtros);
        try {
            const result = await client.listar(filtros);
            setReservas(result.data);
            setTotal(result.total);
        } catch (err: any) {
            console.error('[Reservas] Error cargando:', err);
            toast.error('Error al cargar reservas');
        } finally {
            setCargando(false);
        }
    }, [client, toast]);

    const crear = useCallback(async (dto: CrearReservaDTO): Promise<Reserva> => {
        setCargando(true);
        try {
            const reserva = await client.crear(dto);
            toast.success('Reserva creada correctamente');
            // Refrescar lista
            await cargar(ultimosFiltros);
            return reserva;
        } catch (err: any) {
            const msg = err?.message || 'Error al crear reserva';
            toast.error(msg);
            throw err;
        } finally {
            setCargando(false);
        }
    }, [client, toast, cargar, ultimosFiltros]);

    const liberar = useCallback(async (dto: LiberarReservaDTO): Promise<Reserva> => {
        setCargando(true);
        try {
            const reserva = await client.liberar(dto);
            toast.success('Reserva liberada correctamente');
            await cargar(ultimosFiltros);
            return reserva;
        } catch (err: any) {
            const msg = err?.message || 'Error al liberar reserva';
            toast.error(msg);
            throw err;
        } finally {
            setCargando(false);
        }
    }, [client, toast, cargar, ultimosFiltros]);

    const cancelar = useCallback(async (id: string, motivo?: string) => {
        setCargando(true);
        try {
            await client.cancelar(id, motivo);
            toast.success('Reserva cancelada');
            await cargar(ultimosFiltros);
        } catch (err: any) {
            const msg = err?.message || 'Error al cancelar reserva';
            toast.error(msg);
            throw err;
        } finally {
            setCargando(false);
        }
    }, [client, toast, cargar, ultimosFiltros]);

    const consumir = useCallback(async (id: string) => {
        setCargando(true);
        try {
            await client.consumir(id);
            toast.success('Reserva consumida - stock reducido');
            await cargar(ultimosFiltros);
        } catch (err: any) {
            const msg = err?.message || 'Error al consumir reserva';
            toast.error(msg);
            throw err;
        } finally {
            setCargando(false);
        }
    }, [client, toast, cargar, ultimosFiltros]);

    const obtenerResumen = useCallback(async (stockItemId: string): Promise<ResumenReservas> => {
        return client.obtenerResumen(stockItemId);
    }, [client]);

    const refrescar = useCallback(async () => {
        await cargar(ultimosFiltros);
    }, [cargar, ultimosFiltros]);

    return {
        reservas,
        cargando,
        total,
        cargar,
        crear,
        liberar,
        cancelar,
        consumir,
        obtenerResumen,
        refrescar,
    };
}
