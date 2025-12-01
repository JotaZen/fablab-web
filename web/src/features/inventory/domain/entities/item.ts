/**
 * Item - Artículos del catálogo
 */

// === TIPOS ===

export type EstadoItem = 'active' | 'draft' | 'archived';

// === ENTIDADES ===

/** Producto del catálogo */
export interface Item {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  uomId?: string;
  notas?: string;
  estado: EstadoItem;
  terminoIds?: string[];
  creadoEn: string;
  actualizadoEn: string;
}

// === DTOs ===

export interface CrearItemDTO {
  codigo?: string;
  nombre: string;
  descripcion?: string;
  uomId?: string;
  notas?: string;
  estado?: EstadoItem;
  terminoIds?: string[];
}

export interface ActualizarItemDTO {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  uomId?: string;
  notas?: string;
  estado?: EstadoItem;
  terminoIds?: string[];
}

// === FILTROS ===

export interface FiltrosItem {
  estado?: EstadoItem;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}
