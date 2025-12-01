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
import type { ApiStockItem, ApiListResponse } from './vessel.types';
import { apiToItemStock } from './vessel.mappers';

export interface StockClientConfig {
  baseUrl: string;
}

export class StockClient implements StockPort {
  private baseUrl: string;

  constructor(config: StockClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  private getHeaders(): HeadersInit {
    return { 'Content-Type': 'application/json' };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  async listarItems(filtros?: FiltrosStock): Promise<ItemStock[]> {
    const params = new URLSearchParams();
    if (filtros?.ubicacionId) params.set('location_id', filtros.ubicacionId);
    if (filtros?.sku) params.set('sku', filtros.sku);
    if (filtros?.catalogoItemId) params.set('catalog_item_id', filtros.catalogoItemId);
    if (filtros?.conCatalogo) params.set('with_catalog', 'true');
    if (filtros?.limite) params.set('limit', String(filtros.limite));
    if (filtros?.offset) params.set('offset', String(filtros.offset));

    const queryString = params.toString();
    // Según doc: GET /v1/stock/items
    const url = `${this.baseUrl}/v1/stock/items${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiStockItem> | ApiStockItem[]>(res);
    
    const data = Array.isArray(response) ? response : response.data;
    return data.map(apiToItemStock);
  }

  async obtenerItem(id: string): Promise<ItemStock | null> {
    try {
      // Según doc: GET /v1/stock/items/{id}
      const url = `${this.baseUrl}/v1/stock/items/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiStockItem>(res);
      return apiToItemStock(data);
    } catch {
      return null;
    }
  }

  async crearItem(dto: CrearItemStockDTO): Promise<ItemStock> {
    // Según doc: POST /v1/stock/items
    const url = `${this.baseUrl}/v1/stock/items`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
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
      }),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  async actualizarItem(id: string, dto: ActualizarItemStockDTO): Promise<ItemStock> {
    // Según doc: PUT /v1/stock/items/{id}
    const url = `${this.baseUrl}/v1/stock/items/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        quantity: dto.cantidad,
        lot_number: dto.numeroLote,
        expiration_date: dto.fechaExpiracion,
        meta: dto.meta,
      }),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  async eliminarItem(id: string): Promise<void> {
    // Según doc: DELETE /v1/stock/items/{id}
    const url = `${this.baseUrl}/v1/stock/items/${id}`;
    const res = await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
    await this.handleResponse<void>(res);
  }

  async ajustarStock(id: string, dto: AjustarStockDTO): Promise<ItemStock> {
    // Según doc: POST /v1/stock/items/{id}/adjust
    const url = `${this.baseUrl}/v1/stock/items/${id}/adjust`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        sku: dto.sku,
        location_id: dto.ubicacionId,
        delta: dto.delta,
        reason: dto.razon,
      }),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  async reservarStock(id: string, dto: ReservarStockDTO): Promise<ItemStock> {
    // Según doc: POST /v1/stock/items/{id}/reserve
    const url = `${this.baseUrl}/v1/stock/items/${id}/reserve`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity: dto.cantidad }),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  async liberarStock(id: string, dto: ReservarStockDTO): Promise<ItemStock> {
    // Según doc: POST /v1/stock/items/{id}/release
    const url = `${this.baseUrl}/v1/stock/items/${id}/release`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity: dto.cantidad }),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }
}

// === FACTORY ===

let _stockClient: StockClient | null = null;

export function getStockClient(config?: Partial<StockClientConfig>): StockClient {
  if (!_stockClient) {
    _stockClient = new StockClient({ baseUrl: config?.baseUrl || '/api/vessel' });
  }
  return _stockClient;
}

export function resetStockClient(): void {
  _stockClient = null;
}
