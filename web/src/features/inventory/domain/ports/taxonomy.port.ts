/**
 * Taxonomy Port - Interface para repositorio de taxonomía
 */

import type { 
  Vocabulario, 
  Termino, 
  ArbolTermino, 
  Breadcrumb,
  FiltrosTerminos,
  FiltrosVocabularios,
} from '../entities/taxonomy';
import type { PaginatedResponse } from '../entities/pagination';

/** Puerto para gestión de vocabularios y términos */
export interface TaxonomyPort {
  // === VOCABULARIOS ===
  listarVocabularios(filtros?: FiltrosVocabularios): Promise<PaginatedResponse<Vocabulario>>;
  obtenerVocabulario(id: string): Promise<Vocabulario | null>;
  crearVocabulario(data: Omit<Vocabulario, 'id'>): Promise<Vocabulario>;
  actualizarVocabulario(id: string, data: Partial<Vocabulario>): Promise<Vocabulario>;
  eliminarVocabulario(id: string): Promise<void>;
  
  // === TÉRMINOS ===
  listarTerminos(filtros?: FiltrosTerminos): Promise<PaginatedResponse<Termino>>;
  obtenerTermino(id: string): Promise<Termino | null>;
  crearTermino(data: Omit<Termino, 'id'>): Promise<Termino>;
  actualizarTermino(id: string, data: Partial<Termino>): Promise<Termino>;
  eliminarTermino(id: string): Promise<void>;
  
  // === ÁRBOL ===
  obtenerArbol(vocabularioId: string): Promise<ArbolTermino[]>;
  obtenerBreadcrumb(terminoId: string): Promise<Breadcrumb[]>;
}
