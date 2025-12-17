/**
 * Tests para Reservation Client
 * 
 * Prueba la lógica del cliente de reservas.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch para capturar las URLs y bodies
const fetchCalls: { url: string; method: string; body?: any }[] = [];
let mockStockItem = {
    id: 'stock-123',
    sku: 'TEST-SKU',
    location_id: 'loc-1',
    catalog_item_id: 'item-1',
    quantity: 100,
    reserved_quantity: 10,
    available_quantity: 90,
    meta: {
        reservations: [] as any[],
    },
};

const mockFetch = vi.fn(async (url: string, options?: RequestInit) => {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body as string) : undefined;

    fetchCalls.push({ url, method, body });

    // Simular respuestas según endpoint
    if (url.includes('/stock/items/show/')) {
        return {
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => mockStockItem,
        };
    }

    if (url.includes('/stock/items/read')) {
        return {
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({
                data: [mockStockItem],
                meta: { total: 1 },
            }),
        };
    }

    if (url.includes('/stock/items/reserve/')) {
        mockStockItem.reserved_quantity += body?.quantity || 0;
        mockStockItem.available_quantity = mockStockItem.quantity - mockStockItem.reserved_quantity;
        return {
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => mockStockItem,
        };
    }

    if (url.includes('/stock/items/release/')) {
        mockStockItem.reserved_quantity -= body?.quantity || 0;
        mockStockItem.available_quantity = mockStockItem.quantity - mockStockItem.reserved_quantity;
        return {
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => mockStockItem,
        };
    }

    if (url.includes('/stock/items/update/')) {
        mockStockItem.meta = body?.meta || mockStockItem.meta;
        return {
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => mockStockItem,
        };
    }

    return {
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
    };
});

vi.stubGlobal('fetch', mockFetch);

// Importar después del mock
import { ReservationClient, resetReservationClient, getReservationClient } from '../reservation.client';

describe('ReservationClient', () => {
    const BASE_URL = 'http://test.local';

    beforeEach(() => {
        fetchCalls.length = 0;
        mockFetch.mockClear();
        resetReservationClient();
        // Reset mock stock item
        mockStockItem = {
            id: 'stock-123',
            sku: 'TEST-SKU',
            location_id: 'loc-1',
            catalog_item_id: 'item-1',
            quantity: 100,
            reserved_quantity: 10,
            available_quantity: 90,
            meta: {
                reservations: [] as any[],
            },
        };
    });

    describe('Singleton', () => {
        it('retorna la misma instancia', () => {
            const client1 = getReservationClient();
            const client2 = getReservationClient();
            expect(client1).toBe(client2);
        });

        it('crea nueva instancia después de reset', () => {
            const client1 = getReservationClient();
            resetReservationClient();
            const client2 = getReservationClient();
            expect(client1).not.toBe(client2);
        });
    });

    describe('crear()', () => {
        it('reserva stock y agrega metadata', async () => {
            const client = new ReservationClient(BASE_URL);

            const reserva = await client.crear({
                stockItemId: 'stock-123',
                cantidad: 5,
                reservadoPor: 'user-1',
                reservadoPorNombre: 'Juan',
                tipoReferencia: 'proyecto',
                referenciaNombre: 'Proyecto X',
            });

            // Debe haber llamado a reserve
            const reserveCall = fetchCalls.find(c => c.url.includes('/reserve/'));
            expect(reserveCall).toBeDefined();
            expect(reserveCall?.body?.quantity).toBe(5);

            // Debe haber llamado a update para meta
            const updateCall = fetchCalls.find(c => c.url.includes('/update/'));
            expect(updateCall).toBeDefined();
            expect(updateCall?.body?.meta?.reservations).toBeDefined();

            // La reserva debe tener los campos correctos
            expect(reserva.cantidad).toBe(5);
            expect(reserva.reservadoPor).toBe('user-1');
            expect(reserva.estado).toBe('activa');
        });

        it('falla si no hay stock disponible', async () => {
            mockStockItem.available_quantity = 3;
            mockStockItem.reserved_quantity = 97;

            const client = new ReservationClient(BASE_URL);

            await expect(
                client.crear({
                    stockItemId: 'stock-123',
                    cantidad: 10,
                    reservadoPor: 'user-1',
                })
            ).rejects.toThrow(/Stock insuficiente/);
        });
    });

    describe('listar()', () => {
        it('extrae reservas de meta de stock items', async () => {
            mockStockItem.meta.reservations = [
                {
                    id: 'res-1',
                    cantidad: 5,
                    reservadoPor: 'user-1',
                    fechaReserva: '2024-01-01T00:00:00Z',
                    estado: 'activa',
                },
                {
                    id: 'res-2',
                    cantidad: 3,
                    reservadoPor: 'user-2',
                    fechaReserva: '2024-01-02T00:00:00Z',
                    estado: 'liberada',
                },
            ];

            const client = new ReservationClient(BASE_URL);
            const { data, total } = await client.listar();

            expect(data.length).toBe(2);
            expect(total).toBe(2);
            expect(data[0].id).toBe('res-1');
            expect(data[1].id).toBe('res-2');
        });

        it('filtra por estado', async () => {
            mockStockItem.meta.reservations = [
                { id: 'res-1', cantidad: 5, reservadoPor: 'u1', fechaReserva: '2024-01-01', estado: 'activa' },
                { id: 'res-2', cantidad: 3, reservadoPor: 'u2', fechaReserva: '2024-01-02', estado: 'liberada' },
            ];

            const client = new ReservationClient(BASE_URL);
            const { data } = await client.listar({ estado: 'activa' });

            expect(data.length).toBe(1);
            expect(data[0].estado).toBe('activa');
        });

        it('filtra solo activas', async () => {
            mockStockItem.meta.reservations = [
                { id: 'res-1', cantidad: 5, reservadoPor: 'u1', fechaReserva: '2024-01-01', estado: 'activa' },
                { id: 'res-2', cantidad: 3, reservadoPor: 'u2', fechaReserva: '2024-01-02', estado: 'expirada' },
            ];

            const client = new ReservationClient(BASE_URL);
            const { data } = await client.listar({ soloActivas: true });

            expect(data.length).toBe(1);
            expect(data[0].id).toBe('res-1');
        });
    });

    describe('liberar()', () => {
        it('libera reserva y actualiza estado', async () => {
            mockStockItem.meta.reservations = [
                { id: 'res-1', cantidad: 5, reservadoPor: 'u1', fechaReserva: '2024-01-01', estado: 'activa' },
            ];

            const client = new ReservationClient(BASE_URL);
            const resultado = await client.liberar({ reservaId: 'res-1' });

            // Debe haber llamado a release
            const releaseCall = fetchCalls.find(c => c.url.includes('/release/'));
            expect(releaseCall).toBeDefined();

            expect(resultado.estado).toBe('liberada');
        });
    });

    describe('obtenerResumen()', () => {
        it('calcula resumen correctamente', async () => {
            mockStockItem.reserved_quantity = 15;
            mockStockItem.meta.reservations = [
                { id: 'res-1', cantidad: 10, reservadoPor: 'u1', fechaReserva: '2024-01-01', estado: 'activa', fechaExpiracion: '2024-12-31' },
                { id: 'res-2', cantidad: 5, reservadoPor: 'u2', fechaReserva: '2024-01-02', estado: 'activa' },
                { id: 'res-3', cantidad: 3, reservadoPor: 'u3', fechaReserva: '2024-01-03', estado: 'liberada' },
            ];

            const client = new ReservationClient(BASE_URL);
            const resumen = await client.obtenerResumen('stock-123');

            expect(resumen.totalReservas).toBe(3);
            expect(resumen.reservasActivas).toBe(2);
            expect(resumen.cantidadTotalReservada).toBe(15);
            expect(resumen.proximaExpiracion).toBe('2024-12-31');
        });
    });
});
