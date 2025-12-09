/**
 * Vessel API - Tipos de respuesta (snake_case)
 */

// === TAXONOMY ===

export interface ApiVocabulary {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

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

export interface ApiTermTree extends ApiTerm {
  children: ApiTermTree[];
}

export interface ApiBreadcrumb {
  id: string;
  name: string;
}

// === LOCATIONS ===

export interface ApiLocation {
  id: string;
  name: string;
  type: string;
  parent_id?: string | null;
  address_id?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

// === STOCK ===

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
  catalog_item?: ApiItem; // Embedded item data (standard)
  item?: ApiItem; // Fallback naming
}

// === ITEMS ===

export interface ApiItem {
  id: string;
  name: string;
  description?: string;
  uom_id?: string;
  notes?: string;
  status: string;
  term_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

// === UOM ===

export interface ApiMeasure {
  id: string;
  code: string;
  name: string;
  symbol: string;
  category: 'length' | 'weight' | 'volume' | 'area' | 'time' | 'quantity' | 'other';
  is_base: boolean;
  conversion_factor: number;
}

export interface ApiConversionResult {
  original_value: number;
  converted_value: number;
  from_unit: string;
  to_unit: string;
}
