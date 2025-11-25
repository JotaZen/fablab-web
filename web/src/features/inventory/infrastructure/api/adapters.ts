/**
 * Adaptadores para transformar datos entre API (snake_case) y Dominio (camelCase español)
 * 
 * IMPORTANTE: Estos adaptadores son DEFENSIVOS - manejan datos incompletos o malformados
 * de la API y siempre devuelven objetos válidos con valores por defecto seguros.
 */

import type {
  ApiVocabulary,
  ApiTerm,
  ApiTermTree,
  ApiBreadcrumb,
} from './types';

import type {
  Vocabulario,
  Termino,
  ArbolTermino,
  Breadcrumb,
} from '../../domain/entities';

// ==================== HELPERS ====================

/** Genera un ID único si no existe */
function ensureId(id: unknown): string {
  if (typeof id === 'string' && id.length > 0) return id;
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Asegura que un valor sea string */
function ensureString(value: unknown, defaultValue = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

/** Asegura que un valor sea número */
function ensureNumber(value: unknown, defaultValue = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/** Convierte a Date si es válido */
function toDateOrUndefined(value: unknown): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? undefined : date;
}

/** Tipo para datos parciales/incompletos de la API */
type PartialApiData = Record<string, unknown>;

// ==================== VOCABULARIOS ====================

/** Convierte un vocabulario de API a dominio (defensivo) */
export function apiToVocabulario(api: ApiVocabulary | PartialApiData | null | undefined): Vocabulario {
  const safeApi = (api ?? {}) as PartialApiData;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
    descripcion: ensureString(safeApi.description) || undefined,
    fechaCreacion: toDateOrUndefined(safeApi.created_at),
    fechaActualizacion: toDateOrUndefined(safeApi.updated_at),
  };
}

/** Convierte un vocabulario de dominio a API */
export function vocabularioToApi(v: Partial<Vocabulario>): Partial<ApiVocabulary> {
  return {
    ...(v.id && { id: v.id }),
    ...(v.nombre && { name: v.nombre }),
    ...(v.descripcion && { description: v.descripcion }),
  };
}

/** Convierte array de vocabularios (filtra inválidos) */
export function apiToVocabularios(apis: unknown): Vocabulario[] {
  if (!Array.isArray(apis)) return [];
  return apis
    .filter((item): item is PartialApiData => item !== null && typeof item === 'object')
    .map(apiToVocabulario);
}

// ==================== TÉRMINOS ====================

/** Convierte un término de API a dominio (defensivo) */
export function apiToTermino(api: ApiTerm | PartialApiData | null | undefined): Termino {
  const safeApi = (api ?? {}) as PartialApiData;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
    vocabularioId: ensureString(safeApi.vocabulary_id),
    padreId: safeApi.parent_id ? ensureString(safeApi.parent_id) : undefined,
    descripcion: ensureString(safeApi.description) || undefined,
    nivel: ensureNumber(safeApi.level, 0),
    fechaCreacion: toDateOrUndefined(safeApi.created_at),
    fechaActualizacion: toDateOrUndefined(safeApi.updated_at),
  };
}

/** Convierte un término de dominio a API */
export function terminoToApi(t: Partial<Termino>): Partial<ApiTerm> {
  return {
    ...(t.id && { id: t.id }),
    ...(t.nombre && { name: t.nombre }),
    ...(t.vocabularioId && { vocabulary_id: t.vocabularioId }),
    ...(t.padreId && { parent_id: t.padreId }),
    ...(t.descripcion && { description: t.descripcion }),
  };
}

/** Convierte array de términos (filtra inválidos) */
export function apiToTerminos(apis: unknown): Termino[] {
  if (!Array.isArray(apis)) return [];
  return apis
    .filter((item): item is PartialApiData => item !== null && typeof item === 'object')
    .map(apiToTermino);
}

// ==================== ÁRBOL Y BREADCRUMB ====================

/** Convierte un árbol de términos de API a dominio (recursivo, defensivo) */
export function apiToArbolTermino(api: ApiTermTree | PartialApiData | null | undefined): ArbolTermino {
  const safeApi = (api ?? {}) as PartialApiData;
  const children = safeApi.children;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
    vocabularioId: ensureString(safeApi.vocabulary_id),
    padreId: safeApi.parent_id ? ensureString(safeApi.parent_id) : undefined,
    descripcion: ensureString(safeApi.description) || undefined,
    nivel: ensureNumber(safeApi.level, 0),
    fechaCreacion: toDateOrUndefined(safeApi.created_at),
    fechaActualizacion: toDateOrUndefined(safeApi.updated_at),
    hijos: Array.isArray(children) 
      ? children.map(apiToArbolTermino) 
      : [],
  };
}

/** Convierte un breadcrumb de API a dominio (defensivo) */
export function apiToBreadcrumb(api: ApiBreadcrumb | PartialApiData | null | undefined): Breadcrumb {
  const safeApi = (api ?? {}) as PartialApiData;
  return {
    id: ensureId(safeApi.id),
    nombre: ensureString(safeApi.name, 'Sin nombre'),
  };
}
