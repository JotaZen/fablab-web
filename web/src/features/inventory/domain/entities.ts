/**
 * ============================================================
 * INVENTORY DOMAIN ENTITIES
 * ============================================================
 * 
 * Entidades del dominio de inventario:
 * - Location: Sede o base física (ej: Camptech)
 * - Venue: Recinto dentro de una location (ej: Laboratorio, Pañol)
 */

/** Tipos de locación */
export type LocationType = 'campus' | 'building' | 'external';

/** Tipos de recinto/venue */
export type VenueType = 'laboratory' | 'warehouse' | 'workshop' | 'office' | 'storage' | 'other';

/** Estado de una locación o recinto */
export type LocationStatus = 'active' | 'inactive' | 'maintenance';

/**
 * Location - Sede o base física
 * Ejemplo: Camptech, Sede Central, etc.
 */
export interface Location {
  id: string;
  
  /** Nombre de la sede */
  name: string;
  
  /** Código único (ej: CAMP, CENTRAL) */
  code: string;
  
  /** Tipo de locación */
  type: LocationType;
  
  /** Dirección física */
  address?: string;
  
  /** Descripción */
  description?: string;
  
  /** Estado */
  status: LocationStatus;
  
  /** Coordenadas para mapa */
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  /** Metadatos */
  createdAt: string;
  updatedAt: string;
}

/**
 * Venue - Recinto dentro de una Location
 * Ejemplo: Laboratorio, Pañol, Bodega Principal
 */
export interface Venue {
  id: string;
  
  /** Nombre del recinto */
  name: string;
  
  /** Código único (ej: LAB-01, PANOL-01) */
  code: string;
  
  /** Tipo de recinto */
  type: VenueType;
  
  /** Location padre */
  locationId: string;
  location?: Location;
  
  /** Descripción */
  description?: string;
  
  /** Capacidad (opcional, para bodegas) */
  capacity?: number;
  
  /** Responsable del recinto */
  managerId?: string;
  managerName?: string;
  
  /** Estado */
  status: LocationStatus;
  
  /** Piso o nivel dentro del edificio */
  floor?: string;
  
  /** Metadatos */
  createdAt: string;
  updatedAt: string;
}

/**
 * DTOs para crear/actualizar
 */
export interface CreateLocationDTO {
  name: string;
  code: string;
  type: LocationType;
  address?: string;
  description?: string;
  status?: LocationStatus;
  coordinates?: { lat: number; lng: number };
}

export interface UpdateLocationDTO extends Partial<CreateLocationDTO> {}

export interface CreateVenueDTO {
  name: string;
  code: string;
  type: VenueType;
  locationId: string;
  description?: string;
  capacity?: number;
  managerId?: string;
  status?: LocationStatus;
  floor?: string;
}

export interface UpdateVenueDTO extends Partial<CreateVenueDTO> {}

/**
 * Filtros para consultas
 */
export interface LocationFilters {
  type?: LocationType;
  status?: LocationStatus;
  search?: string;
}

export interface VenueFilters {
  locationId?: string;
  type?: VenueType;
  status?: LocationStatus;
  search?: string;
}

/**
 * Labels en español
 */
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

// ============================================================
// STOCK - INVENTARIO
// ============================================================

/** Tipo de ubicación de stock */
export type TipoUbicacionStock = 'warehouse' | 'store' | 'office' | 'distribution_center';

/**
 * ItemStock - Un item en el inventario
 * Representa la cantidad de un producto en una ubicación específica
 */
export interface ItemStock {
  id: string;
  
  /** SKU del producto */
  sku: string;
  
  /** Referencia al item de catálogo */
  catalogoItemId?: string;
  
  /** Origen del catálogo */
  catalogoOrigen?: string;
  
  /** ID de la ubicación (Location) */
  ubicacionId: string;
  
  /** Tipo de ubicación */
  tipoUbicacion: TipoUbicacionStock;
  
  /** Cantidad total */
  cantidad: number;
  
  /** Cantidad reservada */
  cantidadReservada: number;
  
  /** Cantidad disponible (calculado) */
  cantidadDisponible: number;
  
  /** Número de lote (opcional) */
  numeroLote?: string;
  
  /** Fecha de expiración (opcional) */
  fechaExpiracion?: string;
  
  /** Número de serie (opcional) */
  numeroSerie?: string;
  
  /** Metadatos adicionales */
  meta?: Record<string, unknown>;
  
  /** Timestamps */
  creadoEn: string;
  actualizadoEn: string;
}

/** DTO para crear item de stock */
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

/** DTO para actualizar item de stock */
export interface ActualizarItemStockDTO {
  cantidad?: number;
  numeroLote?: string;
  fechaExpiracion?: string;
  meta?: Record<string, unknown>;
}

/** DTO para ajustar cantidad de stock */
export interface AjustarStockDTO {
  sku: string;
  ubicacionId: string;
  delta: number;
  razon?: string;
}

/** DTO para reservar/liberar stock */
export interface ReservarStockDTO {
  cantidad: number;
}

/** Filtros para listar stock */
export interface FiltrosStock {
  ubicacionId?: string;
  sku?: string;
  catalogoItemId?: string;
  conCatalogo?: boolean;
  limite?: number;
  offset?: number;
}

// ============================================================
// UOM - UNIDADES DE MEDIDA
// ============================================================

/** Categoría de unidad de medida */
export type CategoriaUoM = 'length' | 'weight' | 'volume' | 'area' | 'time' | 'quantity' | 'other';

/**
 * UnidadMedida - Una unidad de medida
 */
export interface UnidadMedida {
  id: string;
  
  /** Código de la unidad (ej: kg, m, cm) */
  codigo: string;
  
  /** Nombre completo */
  nombre: string;
  
  /** Símbolo (ej: kg, m, cm²) */
  simbolo: string;
  
  /** Categoría */
  categoria: CategoriaUoM;
  
  /** Es unidad base de su categoría */
  esBase: boolean;
  
  /** Factor de conversión a unidad base */
  factorConversion: number;
}

/** DTO para convertir entre unidades */
export interface ConvertirUoMDTO {
  desde: string;
  hasta: string;
  valor: number;
}

/** Resultado de conversión */
export interface ResultadoConversion {
  valorOriginal: number;
  valorConvertido: number;
  unidadOrigen: string;
  unidadDestino: string;
}

// ============================================================
// LABELS EN ESPAÑOL
// ============================================================

export const TIPO_UBICACION_STOCK_LABELS: Record<TipoUbicacionStock, string> = {
  warehouse: 'Bodega',
  store: 'Tienda',
  office: 'Oficina',
  distribution_center: 'Centro de Distribución',
};

export const CATEGORIA_UOM_LABELS: Record<CategoriaUoM, string> = {
  length: 'Longitud',
  weight: 'Peso',
  volume: 'Volumen',
  area: 'Área',
  time: 'Tiempo',
  quantity: 'Cantidad',
  other: 'Otro',
};

// ============================================================
// ITEMS - CATÁLOGO DE PRODUCTOS
// ============================================================

/** Estado de un item */
export type EstadoItem = 'active' | 'draft' | 'archived';

/**
 * Item - Producto del catálogo
 * Representa un artículo que puede tener stock
 */
export interface Item {
  id: string;
  
  /** Código único del item */
  codigo: string;
  
  /** Nombre del artículo */
  nombre: string;
  
  /** Descripción */
  descripcion?: string;
  
  /** ID de unidad de medida */
  uomId?: string;
  
  /** Notas internas */
  notas?: string;
  
  /** Estado del item */
  estado: EstadoItem;
  
  /** IDs de términos de taxonomía (categorías, marcas, etc.) */
  terminoIds?: string[];
  
  /** Timestamps */
  creadoEn: string;
  actualizadoEn: string;
}

/** DTO para crear un item */
export interface CrearItemDTO {
  codigo?: string;
  nombre: string;
  descripcion?: string;
  uomId?: string;
  notas?: string;
  estado?: EstadoItem;
  terminoIds?: string[];
}

/** DTO para actualizar un item */
export interface ActualizarItemDTO extends Partial<CrearItemDTO> {}

/** Filtros para listar items */
export interface FiltrosItem {
  estado?: EstadoItem;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}

/** Labels en español para estado de item */
export const ESTADO_ITEM_LABELS: Record<EstadoItem, string> = {
  active: 'Activo',
  draft: 'Borrador',
  archived: 'Archivado',
};

// ============================================================
// MOVIMIENTOS DE INVENTARIO
// ============================================================

/** Tipo de movimiento */
export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste' | 'transferencia';

/** Razón del movimiento */
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

/**
 * Movimiento - Registro de entrada/salida de stock
 */
export interface Movimiento {
  id: string;
  
  /** Item afectado */
  itemId: string;
  item?: Item;
  
  /** Tipo de movimiento */
  tipo: TipoMovimiento;
  
  /** Razón del movimiento */
  razon: RazonMovimiento;
  
  /** Cantidad (positiva para entrada, negativa para salida) */
  cantidad: number;
  
  /** Ubicación origen (para transferencias) */
  ubicacionOrigenId?: string;
  
  /** Ubicación destino */
  ubicacionDestinoId?: string;
  
  /** Observaciones */
  observaciones?: string;
  
  /** Usuario que realizó el movimiento */
  usuarioId?: string;
  usuarioNombre?: string;
  
  /** Referencia externa (ej: número de compra, préstamo, etc.) */
  referenciaExterna?: string;
  
  /** Timestamps */
  creadoEn: string;
}

/** DTO para crear movimiento */
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

/** Filtros para movimientos */
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

/** Labels en español */
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

// ============================================================
// STOCK SIMPLIFICADO (como el Excel)
// ============================================================

/**
 * StockItem - Stock de un item (vista simplificada)
 * Similar a la estructura del Excel: Código, Artículo, Entradas, Salidas, Stock
 */
export interface StockItem {
  id: string;
  
  /** Item del catálogo */
  itemId: string;
  item?: Item;
  
  /** Código del item */
  codigo: string;
  
  /** Nombre del artículo */
  nombre: string;
  
  /** Total de entradas */
  entradas: number;
  
  /** Total de salidas */
  salidas: number;
  
  /** Stock actual (entradas - salidas) */
  stock: number;
  
  /** Stock reservado */
  reservado: number;
  
  /** Stock disponible (stock - reservado) */
  disponible: number;
  
  /** Observaciones */
  observaciones?: string;
  
  /** Ubicación (opcional) */
  ubicacionId?: string;
  ubicacionNombre?: string;
}
