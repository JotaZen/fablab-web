/**
 * Vessel API - Mappers (API snake_case <-> Domain camelCase)
 */

import type {
  ApiVocabulary,
  ApiTerm,
  ApiTermTree,
  ApiBreadcrumb,
  ApiLocation,
  ApiStockItem,
  ApiItem,
  ApiMeasure,
  ApiConversionResult,
} from './vessel.types';

import type { Vocabulario, Termino, ArbolTermino, Breadcrumb } from '../../domain/entities/taxonomy';
import type { Locacion, TipoLocacion } from '../../domain/entities/location';
import type { ItemStock, TipoUbicacionStock } from '../../domain/entities/stock';
import type { Item, EstadoItem } from '../../domain/entities/item';
import type { UnidadMedida, ResultadoConversion } from '../../domain/entities/uom';

// === HELPERS ===

function ensureId(id: unknown): string {
  if (typeof id === 'string' && id.length > 0) return id;
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function ensureString(value: unknown, defaultValue = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

function toDateOrUndefined(value: unknown): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? undefined : date;
}

// === TAXONOMY MAPPERS ===

export function apiToVocabulario(api: ApiVocabulary | null | undefined): Vocabulario {
  const safeApi = (api ?? {}) as Record<string, unknown>;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
    descripcion: ensureString(safeApi.description) || undefined,
    fechaCreacion: toDateOrUndefined(safeApi.created_at),
    fechaActualizacion: toDateOrUndefined(safeApi.updated_at),
  };
}

export function vocabularioToApi(v: Partial<Vocabulario>): Partial<ApiVocabulary> & { slug?: string } {
  return {
    ...(v.id && { id: v.id }),
    ...(v.nombre && { name: v.nombre }),
    ...(v.slug && { slug: v.slug }),
    ...(v.descripcion && { description: v.descripcion }),
  };
}

export function apiToTermino(api: ApiTerm | null | undefined): Termino {
  const safeApi = (api ?? {}) as Record<string, unknown>;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
    vocabularioId: ensureString(safeApi.vocabulary_id),
    padreId: safeApi.parent_id ? ensureString(safeApi.parent_id) : undefined,
    descripcion: ensureString(safeApi.description) || undefined,
    nivel: typeof safeApi.level === 'number' ? safeApi.level : 0,
    fechaCreacion: toDateOrUndefined(safeApi.created_at),
    fechaActualizacion: toDateOrUndefined(safeApi.updated_at),
  };
}

export function terminoToApi(t: Partial<Termino> & { vocabularioSlug?: string }): Record<string, any> {
  return {
    ...(t.id && { id: t.id }),
    ...(t.nombre && { name: t.nombre }),
    ...(t.vocabularioId && { vocabulary_id: t.vocabularioId }),
    ...(t.vocabularioSlug && { vocabulary_slug: t.vocabularioSlug }),
    ...(t.padreId && { parent_id: t.padreId }),
    ...(t.descripcion && { description: t.descripcion }),
  };
}

export function apiToArbolTermino(api: ApiTermTree | null | undefined): ArbolTermino {
  const safeApi = (api ?? {}) as Record<string, unknown>;
  const children = safeApi.children;
  return {
    ...apiToTermino(api as ApiTerm),
    hijos: Array.isArray(children) ? children.map(apiToArbolTermino) : [],
  };
}

export function apiToBreadcrumb(api: ApiBreadcrumb | null | undefined): Breadcrumb {
  const safeApi = (api ?? {}) as Record<string, unknown>;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
  };
}

// === LOCATION MAPPERS ===

export function apiToLocacion(api: ApiLocation): Locacion {
  return {
    id: api.id,
    nombre: api.name,
    tipo: (api.type as TipoLocacion) || 'warehouse',
    padreId: api.parent_id || undefined,
    addressId: api.address_id || undefined,
    descripcion: api.description || undefined,
    creadoEn: api.created_at || new Date().toISOString(),
    actualizadoEn: api.updated_at || new Date().toISOString(),
  };
}

// === STOCK MAPPERS ===

export function apiToItemStock(api: ApiStockItem): ItemStock {
  return {
    id: api.id,
    sku: api.sku,
    catalogoItemId: api.catalog_item_id,
    catalogoOrigen: api.catalog_origin,
    ubicacionId: api.location_id,
    tipoUbicacion: api.location_type as TipoUbicacionStock,
    cantidad: api.quantity,
    cantidadReservada: api.reserved_quantity,
    cantidadDisponible: api.available_quantity,
    numeroLote: api.lot_number,
    fechaExpiracion: api.expiration_date,
    numeroSerie: api.serial_number,
    meta: api.meta,
    creadoEn: api.created_at || new Date().toISOString(),
    actualizadoEn: api.updated_at || new Date().toISOString(),
    item: (api.catalog_item || api.item) ? apiToItem(api.catalog_item || api.item!) : undefined,
  };
}

// === ITEM MAPPERS ===

function generarCodigo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ITEM-${timestamp.slice(-4)}${random}`;
}

export function apiToItem(api: ApiItem): Item {
  const itemId = typeof api.id === 'string' ? api.id : String(api.id || '');
  const codigo = itemId ? itemId.substring(0, 8).toUpperCase() : generarCodigo();

  return {
    id: itemId,
    codigo,
    nombre: api.name || 'Sin nombre',
    descripcion: api.description,
    uomId: api.uom_id,
    notas: api.notes,
    estado: (api.status || 'active') as EstadoItem,
    terminoIds: api.term_ids,
    creadoEn: api.created_at || new Date().toISOString(),
    actualizadoEn: api.updated_at || new Date().toISOString(),
  };
}

// === UOM MAPPERS ===

export function apiToUnidadMedida(api: ApiMeasure): UnidadMedida {
  return {
    id: api.id,
    codigo: api.code,
    nombre: api.name,
    simbolo: api.symbol,
    categoria: api.category,
    esBase: api.is_base,
    factorConversion: api.conversion_factor,
  };
}

export function apiToResultadoConversion(api: ApiConversionResult): ResultadoConversion {
  return {
    valorOriginal: api.original_value,
    valorConvertido: api.converted_value,
    unidadOrigen: api.from_unit,
    unidadDestino: api.to_unit,
  };
}
