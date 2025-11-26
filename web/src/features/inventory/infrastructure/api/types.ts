/**
 * Tipos de la API de Vessel (snake_case)
 * Estos tipos representan la estructura de datos que viene de la API
 */

/** Vocabulario como viene de la API */
export interface ApiVocabulary {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/** Término como viene de la API */
export interface ApiTerm {
  id: string;
  name: string;
  vocabulary_id: string;
  parent_id?: string | null;
  description?: string;
  level?: number;
  created_at?: string;
  updated_at?: string;
}

/** Árbol de términos de la API */
export interface ApiTermTree extends ApiTerm {
  children: ApiTermTree[];
}

/** Breadcrumb de la API */
export interface ApiBreadcrumb {
  id: string;
  name: string;
}

/** Respuesta de lista de la API */
export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

// ============================================================
// LOCATIONS API TYPES
// ============================================================

/** Location (sede) como viene de la API */
export interface ApiLocation {
  id: string;
  name: string;
  code: string;
  type: 'campus' | 'building' | 'external';
  address?: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
}

/** Venue (recinto) como viene de la API */
export interface ApiVenue {
  id: string;
  name: string;
  code: string;
  type: 'laboratory' | 'warehouse' | 'workshop' | 'office' | 'storage' | 'other';
  location_id: string;
  description?: string;
  capacity?: number;
  manager_id?: string;
  manager_name?: string;
  status: 'active' | 'inactive' | 'maintenance';
  floor?: string;
  created_at?: string;
  updated_at?: string;
}

/** Payload para crear location */
export interface ApiCreateLocation {
  name: string;
  code: string;
  type: 'campus' | 'building' | 'external';
  address?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  lat?: number;
  lng?: number;
}

/** Payload para crear venue */
export interface ApiCreateVenue {
  name: string;
  code: string;
  type: 'laboratory' | 'warehouse' | 'workshop' | 'office' | 'storage' | 'other';
  location_id: string;
  description?: string;
  capacity?: number;
  manager_id?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  floor?: string;
}

// ============================================================
// STOCK API TYPES
// ============================================================

/** StockItem como viene de la API */
export interface ApiStockItem {
  id: string;
  sku: string;
  catalog_item_id?: string;
  catalog_origin?: string;
  location_id: string;
  location_type: 'warehouse' | 'store' | 'office' | 'distribution_center';
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  lot_number?: string;
  expiration_date?: string;
  serial_number?: string;
  workspace_id?: string;
  meta?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

/** Payload para crear StockItem */
export interface ApiCreateStockItem {
  sku: string;
  catalog_item_id?: string;
  catalog_origin?: string;
  location_id: string;
  location_type?: 'warehouse' | 'store' | 'office' | 'distribution_center';
  quantity: number;
  lot_number?: string;
  expiration_date?: string;
  serial_number?: string;
  meta?: Record<string, unknown>;
}

/** Payload para actualizar StockItem */
export interface ApiUpdateStockItem {
  quantity?: number;
  lot_number?: string;
  expiration_date?: string;
  meta?: Record<string, unknown>;
}

/** Payload para ajustar stock */
export interface ApiAdjustStock {
  sku: string;
  location_id: string;
  delta: number;
  reason?: string;
}

/** Payload para reservar/liberar stock */
export interface ApiReserveStock {
  quantity: number;
}

// ============================================================
// UOM API TYPES
// ============================================================

/** UnidadMedida como viene de la API */
export interface ApiMeasure {
  id: string;
  code: string;
  name: string;
  symbol: string;
  category: 'length' | 'weight' | 'volume' | 'area' | 'time' | 'quantity' | 'other';
  is_base: boolean;
  conversion_factor: number;
}

/** Payload para convertir entre unidades */
export interface ApiConvertMeasure {
  from: string;
  to: string;
  value: number;
}

/** Resultado de conversión */
export interface ApiConversionResult {
  original_value: number;
  converted_value: number;
  from_unit: string;
  to_unit: string;
}
