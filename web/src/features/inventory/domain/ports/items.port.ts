/**
 * Items Port - Interface para repositorio de items
 */

import type { Item, CrearItemDTO, ActualizarItemDTO, FiltrosItem } from '../entities/item';

/** Puerto para gestión de items del catálogo */
export interface ItemsPort {
  listar(filtros?: FiltrosItem): Promise<{ items: Item[]; total: number }>;
  obtener(id: string): Promise<Item | null>;
  crear(data: CrearItemDTO): Promise<Item>;
  actualizar(id: string, data: ActualizarItemDTO): Promise<Item>;
  eliminar(id: string): Promise<void>;
  
  // Helpers
  listarActivos(): Promise<Item[]>;
  buscar(termino: string): Promise<Item[]>;
}
