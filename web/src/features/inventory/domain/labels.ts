/**
 * Labels en español para el módulo de inventario
 */

import type { LocationType, VenueType, LocationStatus, TipoLocacion } from './entities/location';
import type { EstadoItem } from './entities/item';
import type { TipoUbicacionStock, TipoMovimiento, RazonMovimiento } from './entities/stock';
import type { CategoriaUoM } from './entities/uom';

// === LOCATIONS ===

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  campus: 'Campus',
  building: 'Edificio',
  external: 'Externo',
};

export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  laboratory: 'Laboratorio',
  warehouse: 'Bodega',
  workshop: 'Taller',
  office: 'Oficina',
  storage: 'Almacén',
  other: 'Otro',
};

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  maintenance: 'En Mantenimiento',
};

export const TIPO_LOCACION_LABELS: Record<TipoLocacion, string> = {
  warehouse: 'Locación',
  storage_unit: 'Unidad de Almacenamiento',
};

// === ITEMS ===

export const ESTADO_ITEM_LABELS: Record<EstadoItem, string> = {
  active: 'Activo',
  draft: 'Borrador',
  archived: 'Archivado',
};

// === STOCK ===

export const TIPO_UBICACION_STOCK_LABELS: Record<TipoUbicacionStock, string> = {
  warehouse: 'Bodega',
  store: 'Tienda',
  office: 'Oficina',
  distribution_center: 'Centro de Distribución',
};

export const TIPO_MOVIMIENTO_LABELS: Record<TipoMovimiento, string> = {
  entrada: 'Entrada',
  salida: 'Salida',
  ajuste: 'Ajuste',
  transferencia: 'Transferencia',
};

export const RAZON_MOVIMIENTO_LABELS: Record<RazonMovimiento, string> = {
  compra: 'Compra',
  devolucion: 'Devolución',
  prestamo: 'Préstamo',
  retorno_prestamo: 'Retorno de Préstamo',
  ajuste_inventario: 'Ajuste de Inventario',
  merma: 'Merma',
  donacion: 'Donación',
  transferencia: 'Transferencia',
  otro: 'Otro',
};

// === UOM ===

export const CATEGORIA_UOM_LABELS: Record<CategoriaUoM, string> = {
  length: 'Longitud',
  weight: 'Peso',
  volume: 'Volumen',
  area: 'Área',
  time: 'Tiempo',
  quantity: 'Cantidad',
  other: 'Otro',
};
