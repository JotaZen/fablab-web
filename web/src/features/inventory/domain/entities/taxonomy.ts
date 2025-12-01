/**
 * Taxonomy - Vocabularios y términos para clasificación
 */

// === ENTIDADES ===

/** Vocabulario (agrupa términos) */
export interface Vocabulario {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

/** Término (elemento de un vocabulario) */
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

/** Árbol de términos */
export interface ArbolTermino extends Termino {
  hijos: ArbolTermino[];
}

/** Breadcrumb para navegación */
export interface Breadcrumb {
  id: string;
  nombre: string;
}

// === FILTROS ===

export interface FiltrosTerminos {
  vocabularioId?: string;
  padreId?: string;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}

export interface FiltrosVocabularios {
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}
