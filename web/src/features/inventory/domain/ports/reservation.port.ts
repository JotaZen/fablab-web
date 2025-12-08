/**
 * Puerto de Reservas
 * 
 * Define la interfaz que debe implementar cualquier adaptador de reservas.
 * Siguiendo arquitectura hexagonal, el dominio define QUÉ necesita,
 * y el adaptador (infrastructure) define CÓMO lo obtiene.
 */

import type {
    Reserva,
    CrearReservaDTO,
    LiberarReservaDTO,
    FiltrosReserva,
    ResumenReservas,
} from '../entities/reservation';

export interface ReservationPort {
    /** Listar reservas con filtros */
    listar(filtros?: FiltrosReserva): Promise<{ data: Reserva[]; total: number }>;

    /** Obtener una reserva por ID */
    obtener(id: string): Promise<Reserva | null>;

    /** Crear una nueva reserva */
    crear(dto: CrearReservaDTO): Promise<Reserva>;

    /** Liberar una reserva (total o parcial) */
    liberar(dto: LiberarReservaDTO): Promise<Reserva>;

    /** Cancelar una reserva */
    cancelar(id: string, motivo?: string): Promise<void>;

    /** Consumir reserva (convertir en salida de stock) */
    consumir(id: string): Promise<void>;

    /** Obtener resumen de reservas para un stock item */
    obtenerResumen(stockItemId: string): Promise<ResumenReservas>;

    /** Obtener reservas activas de un usuario */
    obtenerPorUsuario(usuarioId: string): Promise<Reserva[]>;

    /** Verificar y marcar reservas expiradas (job) */
    verificarExpiraciones?(): Promise<number>;
}
