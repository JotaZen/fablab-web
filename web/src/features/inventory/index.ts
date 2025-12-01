/**
 * Inventory Feature - Public API
 */

// ============================================================
// DOMAIN - Entities
// ============================================================

// Location
export type { 
  Location, 
  Venue, 
  LocationType, 
  VenueType, 
  LocationStatus,
  Locacion,
  LocacionConHijos,
  TipoLocacion,
  CreateLocationDTO,
  UpdateLocationDTO,
  CreateVenueDTO,
  UpdateVenueDTO,
  CrearLocacionDTO,
  ActualizarLocacionDTO,
  LocationFilters,
  VenueFilters,
} from './domain/entities/location';

// Item
export type { 
  Item, 
  EstadoItem, 
  CrearItemDTO, 
  ActualizarItemDTO, 
  FiltrosItem,
} from './domain/entities/item';

// Stock
export type { 
  ItemStock, 
  Movimiento,
  StockItem,
  TipoUbicacionStock, 
  TipoMovimiento, 
  RazonMovimiento,
  CrearItemStockDTO,
  ActualizarItemStockDTO,
  AjustarStockDTO,
  ReservarStockDTO,
  CrearMovimientoDTO,
  FiltrosStock,
  FiltrosMovimiento,
} from './domain/entities/stock';

// Taxonomy
export type { 
  Vocabulario, 
  Termino, 
  ArbolTermino, 
  Breadcrumb,
  FiltrosTerminos,
  FiltrosVocabularios,
} from './domain/entities/taxonomy';

// UoM
export type { 
  UnidadMedida, 
  CategoriaUoM,
  ConvertirUoMDTO,
  ResultadoConversion,
} from './domain/entities/uom';

// Pagination
export type { PaginatedResponse, PaginatedResult } from './domain/entities/pagination';

// ============================================================
// DOMAIN - Ports
// ============================================================

export type { LocationsPort, LocacionesPort } from './domain/ports/locations.port';
export type { ItemsPort } from './domain/ports/items.port';
export type { StockPort } from './domain/ports/stock.port';
export type { TaxonomyPort } from './domain/ports/taxonomy.port';
export type { UoMPort } from './domain/ports/uom.port';

// ============================================================
// DOMAIN - Labels & Constants
// ============================================================

export {
  LOCATION_TYPE_LABELS,
  VENUE_TYPE_LABELS,
  LOCATION_STATUS_LABELS,
  TIPO_LOCACION_LABELS,
  ESTADO_ITEM_LABELS,
  TIPO_UBICACION_STOCK_LABELS,
  TIPO_MOVIMIENTO_LABELS,
  RAZON_MOVIMIENTO_LABELS,
  CATEGORIA_UOM_LABELS,
} from './domain/labels';

export {
  VOCABULARIOS,
  VOCABULARIOS_BASE,
  TERMINOS_CATEGORIAS,
  TERMINOS_MARCAS,
  TERMINOS_ETIQUETAS,
  TERMINOS_ESTADOS,
  TERMINOS_COLORES,
} from './domain/seeds';

// ============================================================
// INFRASTRUCTURE - Vessel API Clients
// ============================================================

export { ItemsClient, getItemsClient, resetItemsClient } from './infrastructure/vessel/items.client';
export { StockClient, getStockClient, resetStockClient } from './infrastructure/vessel/stock.client';
export { LocationClient, getLocationClient, resetLocationClient } from './infrastructure/vessel/locations.client';
export { TaxonomyClient, getTaxonomyClient, resetTaxonomyClient } from './infrastructure/vessel/taxonomy.client';
export { UoMClient, getUoMClient, resetUoMClient } from './infrastructure/vessel/uom.client';

// ============================================================
// PRESENTATION - Hooks
// ============================================================

export { useItems } from './presentation/hooks/use-items';
export { useStock } from './presentation/hooks/use-stock';
export { useTaxonomy } from './presentation/hooks/use-taxonomy';
export { useSelectoresItem } from './presentation/hooks/use-selectores-item';
export { useLocations } from './presentation/use-locations';

// ============================================================
// PRESENTATION - Components
// ============================================================

// Items
export { TablaItems } from './presentation/components/items/tabla-items';
export { FormularioItem } from './presentation/components/items/formulario-item';
export { FormularioItemCompleto } from './presentation/components/items/formulario-item-completo';

// Stock
export { TablaStock } from './presentation/components/stock/tabla-stock';

// Locations
export { ListaSedes } from './presentation/components/locations/locations-list';

// Taxonomy
export { VocabulariosList } from './presentation/components/vocabularios/vocabularios-list';
export { TerminosList } from './presentation/components/terminos/terminos-list';

// Movimientos
export { MovimientosPanel } from './presentation/components/movimientos/movimientos-panel';

// ============================================================
// PRESENTATION - Pages
// ============================================================

export { InventoryDashboard } from './presentation/pages/inventory-dashboard';
export { StockDashboard } from './presentation/pages/stock-dashboard';
export { ArticulosDashboard } from './presentation/pages/articulos-dashboard';
export { CatalogoDashboard } from './presentation/pages/catalogo-dashboard';
export { LocationsDashboard } from './presentation/pages/locations-dashboard';
export { KardexDashboard } from './presentation/pages/kardex-dashboard';
