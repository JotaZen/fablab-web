/**
 * Entidad de Reserva
 * 
 * Representa una reserva de stock para un proyecto, orden o usuario.
 * La reserva "bloquea" cierta cantidad de stock sin salir del inventario.
 * 
 * Campos del dominio que manejamos internamente, independiente de cómo
 * el adaptador los transforme para/desde la API.
 */

// Estados posibles de una reserva
export type EstadoReserva =
    | 'activa'      // Reserva vigente
    | 'liberada'    // Liberada manualmente
    | 'consumida'   // Stock fue usado (salida)
    | 'expirada'    // Pasó la fecha límite
    | 'cancelada'   // Cancelada por el usuario
    | 'pendiente'   // A la espera de aprobación
    | 'rechazada';  // Rechazada por el admin

// ...

export const ESTADO_RESERVA_LABELS: Record<EstadoReserva, string> = {
    activa: 'Activa',
    liberada: 'Liberada',
    consumida: 'Consumida',
    expirada: 'Expirada',
    cancelada: 'Cancelada',
    pendiente: 'Pendiente',
    rechazada: 'Rechazada',
};

export const ESTADO_RESERVA_COLORS: Record<EstadoReserva, string> = {
    activa: 'bg-blue-100 text-blue-800 border-blue-300',
    liberada: 'bg-green-100 text-green-800 border-green-300',
    consumida: 'bg-purple-100 text-purple-800 border-purple-300',
    expirada: 'bg-amber-100 text-amber-800 border-amber-300',
    cancelada: 'bg-gray-100 text-gray-800 border-gray-300',
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    rechazada: 'bg-red-100 text-red-800 border-red-300',
};

/** Entidad de Reserva de Stock */
export interface Reserva {
    id: string;

    // Referencia al stock reservado
    stockItemId: string;
    itemNombre?: string; // Hydrated field
    catalogoItemId?: string;
    ubicacionId: string;

    // Cantidad reservada
    cantidad: number;

    // Quién reservó
    reservadoPor: string;          // ID o nombre del usuario
    reservadoPorNombre?: string;   // Nombre display

    // Para qué (referencia opcional)
    tipoReferencia?: 'proyecto' | 'orden' | 'cliente' | 'otro';
    referenciaId?: string;
    referenciaNombre?: string;     // Nombre del proyecto/orden

    // Temporalidad
    fechaReserva: string;          // ISO date
    fechaExpiracion?: string;      // ISO date - hasta cuándo vale
    fechaLiberacion?: string;      // Cuando se liberó (si aplica)

    // Estado
    estado: EstadoReserva;

    // Notas
    notas?: string;

    // Metadata flexible
    meta?: Record<string, unknown>;

    // Timestamps
    createdAt?: string;
    updatedAt?: string;
}

/** DTO para crear una reserva */
export interface CrearReservaDTO {
    stockItemId: string;
    cantidad: number;
    reservadoPor: string;
    reservadoPorNombre?: string;
    tipoReferencia?: 'proyecto' | 'orden' | 'cliente' | 'otro';
    referenciaId?: string;
    referenciaNombre?: string;
    fechaExpiracion?: string;
    notas?: string;
    estado?: EstadoReserva;
    meta?: Record<string, unknown>;
}

/** DTO para liberar una reserva */
export interface LiberarReservaDTO {
    reservaId: string;
    cantidad?: number;  // Si no se especifica, libera todo
    motivo?: string;
}

/** Filtros para buscar reservas */
export interface FiltrosReserva {
    stockItemId?: string;
    catalogoItemId?: string;
    ubicacionId?: string;
    reservadoPor?: string;
    tipoReferencia?: string;
    referenciaId?: string;
    estado?: EstadoReserva | EstadoReserva[];
    fechaDesde?: string;
    fechaHasta?: string;
    soloActivas?: boolean;
    limite?: number;
    offset?: number;
}

/** Resumen de reservas por item/ubicación */
export interface ResumenReservas {
    totalReservas: number;
    cantidadTotalReservada: number;
    reservasActivas: number;
    proximaExpiracion?: string;
}



export const TIPO_REFERENCIA_LABELS: Record<string, string> = {
    proyecto: 'Proyecto',
    orden: 'Orden de trabajo',
    cliente: 'Cliente',
    otro: 'Otro',
};
