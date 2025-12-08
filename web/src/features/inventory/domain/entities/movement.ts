/**
 * Movements (Kardex)
 * 
 * Entidades para movimientos de inventario
 */

// Tipos de movimiento
export type TipoMovimiento =
    // Entrada
    | 'receipt'        // Recepción de proveedor
    | 'return'         // Devolución de cliente
    | 'adjustment_in'  // Ajuste positivo
    | 'transfer_in'    // Entrada por transferencia
    | 'production'     // Entrada por producción
    // Salida
    | 'shipment'       // Envío/despacho
    | 'consumption'    // Consumo interno
    | 'adjustment_out' // Ajuste negativo
    | 'transfer_out'   // Salida por transferencia
    | 'damage'         // Pérdida por daño
    | 'expiration'     // Pérdida por vencimiento
    | 'installation'   // Consumo por servicio
    // Reserva
    | 'reserve'        // Reservar stock
    | 'release'        // Liberar reserva
    // Neutros
    | 'count'          // Conteo físico
    | 'relocation';    // Reubicación

export type EstadoMovimiento = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface Movimiento {
    id: string;
    type: TipoMovimiento;
    status: EstadoMovimiento;
    itemId: string;
    locationId: string;
    quantity: number;
    lotId?: string;
    trackedUnitId?: string;
    sourceLocationId?: string;
    destinationLocationId?: string;
    sourceType?: string;
    sourceId?: string;
    referenceType?: string;
    referenceId?: string;
    reason?: string;
    performedBy?: string;
    workspaceId?: string;
    meta?: Record<string, any>;
    createdAt: string;
    processedAt?: string;
}

export interface CrearMovimientoDTO {
    type: TipoMovimiento;
    itemId: string;
    locationId: string;
    quantity: number;
    lotId?: string;
    sourceType?: string;
    sourceId?: string;
    referenceType?: string;
    referenceId?: string;
    reason?: string;
}

export interface TransferirDTO {
    itemId: string;
    sourceLocationId: string;
    destinationLocationId: string;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
}

export interface AjustarDTO {
    itemId: string;
    locationId: string;
    quantity: number; // positivo o negativo
    reason?: string;
}

export interface FiltrosMovimiento {
    itemId?: string;
    locationId?: string;
    type?: TipoMovimiento;
    status?: EstadoMovimiento;
    desde?: string;
    hasta?: string;
    referenceType?: string;
    referenceId?: string;
    limit?: number;
    offset?: number;
}

// Labels para UI
export const TIPO_MOVIMIENTO_LABELS: Record<TipoMovimiento, string> = {
    receipt: 'Recepción',
    return: 'Devolución',
    adjustment_in: 'Ajuste (+)',
    transfer_in: 'Transferencia (entrada)',
    production: 'Producción',
    shipment: 'Envío',
    consumption: 'Consumo',
    adjustment_out: 'Ajuste (-)',
    transfer_out: 'Transferencia (salida)',
    damage: 'Daño/Merma',
    expiration: 'Vencimiento',
    installation: 'Instalación',
    reserve: 'Reserva',
    release: 'Liberación',
    count: 'Conteo',
    relocation: 'Reubicación',
};

export const ESTADO_MOVIMIENTO_LABELS: Record<EstadoMovimiento, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
    failed: 'Fallido',
};

// Tipos simplificados para UI
export type TipoMovimientoSimple = 'entrada' | 'salida' | 'transferencia' | 'ajuste';

export const TIPOS_SIMPLES: Record<TipoMovimientoSimple, { label: string; tipos: TipoMovimiento[] }> = {
    entrada: { label: 'Entrada de Stock', tipos: ['receipt', 'return', 'production'] },
    salida: { label: 'Salida de Stock', tipos: ['shipment', 'consumption', 'damage', 'installation'] },
    transferencia: { label: 'Transferencia', tipos: ['transfer_in', 'transfer_out'] },
    ajuste: { label: 'Ajuste', tipos: ['adjustment_in', 'adjustment_out'] },
};
