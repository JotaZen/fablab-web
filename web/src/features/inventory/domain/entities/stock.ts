/**
 * Stock - Inventario y movimientos
 */

import type { Item } from './item';

// === TIPOS ===

export type TipoUbicacionStock = 'warehouse' | 'store' | 'office' | 'distribution_center';
export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste' | 'transferencia';
export type RazonMovimiento = 
  | 'compra' 
  | 'devolucion' 
  | 'prestamo' 
  | 'retorno_prestamo'
  | 'ajuste_inventario' 
  | 'merma' 
  | 'donacion'
  | 'transferencia'
  | 'otro';

// === ENTIDADES ===

/** Item en inventario con cantidades */
export interface ItemStock {
  id: string;
  sku: string;
  catalogoItemId?: string;
  catalogoOrigen?: string;
  ubicacionId: string;
  tipoUbicacion: TipoUbicacionStock;
  cantidad: number;
  cantidadReservada: number;
  cantidadDisponible: number;
  numeroLote?: string;
  fechaExpiracion?: string;
  numeroSerie?: string;
  meta?: Record<string, unknown>;
  creadoEn: string;
  actualizadoEn: string;
}

/** Movimiento de inventario */
export interface Movimiento {
  id: string;
  itemId: string;
  item?: Item;
  tipo: TipoMovimiento;
  razon: RazonMovimiento;
  cantidad: number;
  ubicacionOrigenId?: string;
  ubicacionDestinoId?: string;
  observaciones?: string;
  usuarioId?: string;
  usuarioNombre?: string;
  referenciaExterna?: string;
  creadoEn: string;
}

/** Vista simplificada de stock (estilo Excel) */
export interface StockItem {
  id: string;
  itemId: string;
  item?: Item;
  codigo: string;
  nombre: string;
  entradas: number;
  salidas: number;
  stock: number;
  reservado: number;
  disponible: number;
  observaciones?: string;
  ubicacionId?: string;
  ubicacionNombre?: string;
}

// === DTOs ===

export interface CrearItemStockDTO {
  sku: string;
  catalogoItemId?: string;
  catalogoOrigen?: string;
  ubicacionId: string;
  tipoUbicacion?: TipoUbicacionStock;
  cantidad: number;
  numeroLote?: string;
  fechaExpiracion?: string;
  numeroSerie?: string;
  meta?: Record<string, unknown>;
}

export interface ActualizarItemStockDTO {
  cantidad?: number;
  numeroLote?: string;
  fechaExpiracion?: string;
  meta?: Record<string, unknown>;
}

export interface AjustarStockDTO {
  sku: string;
  ubicacionId: string;
  delta: number;
  razon?: string;
}

export interface ReservarStockDTO {
  cantidad: number;
}

export interface CrearMovimientoDTO {
  itemId: string;
  tipo: TipoMovimiento;
  razon: RazonMovimiento;
  cantidad: number;
  ubicacionOrigenId?: string;
  ubicacionDestinoId?: string;
  observaciones?: string;
  referenciaExterna?: string;
}

// === FILTROS ===

export interface FiltrosStock {
  ubicacionId?: string;
  sku?: string;
  catalogoItemId?: string;
  conCatalogo?: boolean;
  limite?: number;
  offset?: number;
}

export interface FiltrosMovimiento {
  itemId?: string;
  tipo?: TipoMovimiento;
  razon?: RazonMovimiento;
  ubicacionId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  porPagina?: number;
}
