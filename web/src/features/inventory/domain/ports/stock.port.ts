/**
 * Stock Port - Interface para repositorio de stock
 */

import type { 
  ItemStock, 
  CrearItemStockDTO, 
  ActualizarItemStockDTO, 
  AjustarStockDTO, 
  ReservarStockDTO,
  FiltrosStock,
} from '../entities/stock';

/** Puerto para gestión de stock/inventario */
export interface StockPort {
  // CRUD
  listarItems(filtros?: FiltrosStock): Promise<ItemStock[]>;
  obtenerItem(id: string): Promise<ItemStock | null>;
  crearItem(datos: CrearItemStockDTO): Promise<ItemStock>;
  actualizarItem(id: string, datos: ActualizarItemStockDTO): Promise<ItemStock>;
  eliminarItem(id: string): Promise<void>;
  
  // Operaciones de stock
  ajustarStock(id: string, datos: AjustarStockDTO): Promise<ItemStock>;
  reservarStock(id: string, datos: ReservarStockDTO): Promise<ItemStock>;
  liberarStock(id: string, datos: ReservarStockDTO): Promise<ItemStock>;
}
