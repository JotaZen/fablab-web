/**
 * Vessel API - Stock Client
 */

import type {
  ItemStock,
  CrearItemStockDTO,
  ActualizarItemStockDTO,
  AjustarStockDTO,
  ReservarStockDTO,
  FiltrosStock,
} from '../../domain/entities/stock';
import type { StockPort } from '../../domain/ports/stock.port';
import type { ApiStockItem } from './vessel.types';
import { apiToItemStock } from './vessel.mappers';
import { VesselBaseClient, extractData, type ApiListResponse } from './base.client';

export class StockClient extends VesselBaseClient implements StockPort {

  async listarItems(filtros?: FiltrosStock): Promise<ItemStock[]> {
    // El servidor tiene límite máximo de 100 por página, traer todas las páginas
    const perPage = 100;
    let allItems: ApiStockItem[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.get<ApiListResponse<ApiStockItem> | ApiStockItem[]>('/api/v1/stock/items/read', {
        params: {
          location_id: filtros?.ubicacionId,
          sku: filtros?.sku,
          catalog_item_id: filtros?.catalogoItemId,
          with_catalog: filtros?.conCatalogo ? 'true' : undefined,
          page: page,
          per_page: perPage,
        },
      });

      const data = extractData(response);
      allItems = allItems.concat(data);

      // Verificar si hay más páginas
      if (Array.isArray(response)) {
        hasMore = false;
      } else {
        const lastPage = response.last_page || 1;
        hasMore = page < lastPage;
        page++;
      }
    }

    return allItems.map(apiToItemStock);
  }

  async obtenerItem(id: string): Promise<ItemStock | null> {
    try {
      const data = await this.get<ApiStockItem>(`/api/v1/stock/items/show/${id}`);
      return apiToItemStock(data);
    } catch {
      return null;
    }
  }

  async crearItem(dto: CrearItemStockDTO): Promise<ItemStock> {
    const response = await this.post<ApiStockItem>('/api/v1/stock/items/create', {
      sku: dto.sku,
      catalog_item_id: dto.catalogoItemId,
      catalog_origin: dto.catalogoOrigen,
      location_id: dto.ubicacionId,
      location_type: dto.tipoUbicacion,
      quantity: dto.cantidad,
      lot_number: dto.numeroLote,
      expiration_date: dto.fechaExpiracion,
      serial_number: dto.numeroSerie,
      meta: dto.meta,
    });
    return apiToItemStock(response);
  }

  async actualizarItem(id: string, dto: ActualizarItemStockDTO): Promise<ItemStock> {
    const response = await this.put<ApiStockItem>(`/api/v1/stock/items/update/${id}`, {
      quantity: dto.cantidad,
      lot_number: dto.numeroLote,
      expiration_date: dto.fechaExpiracion,
      meta: dto.meta,
    });
    return apiToItemStock(response);
  }

  async eliminarItem(id: string): Promise<void> {
    await this.delete(`/api/v1/stock/items/delete/${id}`);
  }

  async ajustarStock(id: string, dto: AjustarStockDTO): Promise<ItemStock> {
    const response = await this.post<ApiStockItem>('/api/v1/stock/items/adjust', {
      sku: dto.sku,
      location_id: dto.ubicacionId,
      delta: dto.delta,
      reason: dto.razon,
    });
    return apiToItemStock(response);
  }

  async reservarStock(id: string, dto: ReservarStockDTO): Promise<ItemStock> {
    const response = await this.post<ApiStockItem>(`/api/v1/stock/items/reserve/${id}`, { quantity: dto.cantidad });
    return apiToItemStock(response);
  }

  async liberarStock(id: string, dto: ReservarStockDTO): Promise<ItemStock> {
    const response = await this.post<ApiStockItem>(`/api/v1/stock/items/release/${id}`, { quantity: dto.cantidad });
    return apiToItemStock(response);
  }
}

// === SINGLETON ===

let _instance: StockClient | null = null;

export function getStockClient(): StockClient {
  if (!_instance) {
    _instance = new StockClient();
  }
  return _instance;
}

export function resetStockClient(): void {
  _instance = null;
}
