/**
 * Entidades de dominio para el módulo de Inventario/Taxonomía
 * 
 * Vocabularios: Categorías, Etiquetas, Colores, Marcas, Modelos, etc.
 * Términos: Elementos dentro de cada vocabulario (ej: Arduino, ESP32, etc.)
 */

/** Vocabulario - agrupa términos relacionados */
export interface Vocabulario {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

/** Término - elemento individual dentro de un vocabulario */
export interface Termino {
  id: string;
  nombre: string;
  vocabularioId: string;
  padreId?: string;
  descripcion?: string;
  nivel?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

/** Árbol de términos con hijos */
export interface ArbolTermino extends Termino {
  hijos: ArbolTermino[];
}

/** Breadcrumb para navegación */
export interface Breadcrumb {
  id: string;
  nombre: string;
}

/** Respuesta paginada genérica */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/** Filtros para listar términos */
export interface FiltrosTerminos {
  vocabularioId?: string;
  padreId?: string;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}

/** Filtros para listar vocabularios */
export interface FiltrosVocabularios {
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}
