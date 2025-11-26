/**
 * Cliente de Stock para la API de Vessel
 * 
 * Maneja las peticiones HTTP para items de inventario y movimientos de stock
 */

import type {
  ItemStock,
  CrearItemStockDTO,
  ActualizarItemStockDTO,
  AjustarStockDTO,
  ReservarStockDTO,
  FiltrosStock,
} from '../../domain/entities';

import type {
  ApiStockItem,
  ApiCreateStockItem,
  ApiUpdateStockItem,
  ApiAdjustStock,
  ApiReserveStock,
  ApiListResponse,
} from './types';

// ============================================================
// ADAPTERS - Transforman entre API (snake_case) y Domain (camelCase)
// ============================================================

function apiToItemStock(api: ApiStockItem): ItemStock {
  return {
    id: api.id,
    sku: api.sku,
    catalogoItemId: api.catalog_item_id,
    catalogoOrigen: api.catalog_origin,
    ubicacionId: api.location_id,
    tipoUbicacion: api.location_type,
    cantidad: api.quantity,
    cantidadReservada: api.reserved_quantity,
    cantidadDisponible: api.available_quantity,
    numeroLote: api.lot_number,
    fechaExpiracion: api.expiration_date,
    numeroSerie: api.serial_number,
    meta: api.meta,
    creadoEn: api.created_at || new Date().toISOString(),
    actualizadoEn: api.updated_at || new Date().toISOString(),
  };
}

function crearItemStockToApi(dto: CrearItemStockDTO): ApiCreateStockItem {
  return {
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
  };
}

function actualizarItemStockToApi(dto: ActualizarItemStockDTO): ApiUpdateStockItem {
  return {
    quantity: dto.cantidad,
    lot_number: dto.numeroLote,
    expiration_date: dto.fechaExpiracion,
    meta: dto.meta,
  };
}

function ajustarStockToApi(dto: AjustarStockDTO): ApiAdjustStock {
  return {
    sku: dto.sku,
    location_id: dto.ubicacionId,
    delta: dto.delta,
    reason: dto.razon,
  };
}

function reservarStockToApi(dto: ReservarStockDTO): ApiReserveStock {
  return {
    quantity: dto.cantidad,
  };
}

// ============================================================
// CONFIGURACIÓN DEL CLIENTE
// ============================================================

export interface StockClientConfig {
  baseUrl: string;
  adapter?: 'local' | 'sql';
}

// ============================================================
// STOCK CLIENT
// ============================================================

export class StockClient {
  private baseUrl: string;
  private adapter: 'local' | 'sql';

  constructor(config: StockClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.adapter = config.adapter ?? 'local';
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.adapter === 'local') {
      headers['X-STOCK-ADAPTER'] = 'local';
    }
    
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  // ============================================================
  // CRUD DE ITEMS DE STOCK
  // ============================================================

  /** Lista items de stock con filtros opcionales */
  async listarItems(filtros?: FiltrosStock): Promise<ItemStock[]> {
    const params = new URLSearchParams();
    if (filtros?.ubicacionId) params.set('location_id', filtros.ubicacionId);
    if (filtros?.sku) params.set('sku', filtros.sku);
    if (filtros?.catalogoItemId) params.set('catalog_item_id', filtros.catalogoItemId);
    if (filtros?.conCatalogo) params.set('with_catalog', 'true');
    if (filtros?.limite) params.set('limit', String(filtros.limite));
    if (filtros?.offset) params.set('offset', String(filtros.offset));

    const queryString = params.toString();
    const url = `${this.baseUrl}/v1/stock/items${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiStockItem> | ApiStockItem[]>(res);
    
    const data = Array.isArray(response) ? response : response.data;
    return data.map(apiToItemStock);
  }

  /** Obtiene un item de stock por ID */
  async obtenerItem(id: string): Promise<ItemStock | null> {
    try {
      const url = `${this.baseUrl}/v1/stock/items/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiStockItem>(res);
      return apiToItemStock(data);
    } catch {
      return null;
    }
  }

  /** Crea un nuevo item de stock */
  async crearItem(datos: CrearItemStockDTO): Promise<ItemStock> {
    const url = `${this.baseUrl}/v1/stock/items`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(crearItemStockToApi(datos)),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  /** Actualiza un item de stock */
  async actualizarItem(id: string, datos: ActualizarItemStockDTO): Promise<ItemStock> {
    const url = `${this.baseUrl}/v1/stock/items/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(actualizarItemStockToApi(datos)),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  /** Elimina un item de stock */
  async eliminarItem(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/stock/items/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(res);
  }

  // ============================================================
  // OPERACIONES DE STOCK
  // ============================================================

  /** Ajusta la cantidad de stock (positivo o negativo) */
  async ajustarStock(id: string, datos: AjustarStockDTO): Promise<ItemStock> {
    const url = `${this.baseUrl}/v1/stock/items/${id}/adjust`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(ajustarStockToApi(datos)),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  /** Reserva una cantidad de stock */
  async reservarStock(id: string, datos: ReservarStockDTO): Promise<ItemStock> {
    const url = `${this.baseUrl}/v1/stock/items/${id}/reserve`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reservarStockToApi(datos)),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }

  /** Libera stock previamente reservado */
  async liberarStock(id: string, datos: ReservarStockDTO): Promise<ItemStock> {
    const url = `${this.baseUrl}/v1/stock/items/${id}/release`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reservarStockToApi(datos)),
    });
    const response = await this.handleResponse<ApiStockItem>(res);
    return apiToItemStock(response);
  }
}

// ============================================================
// FACTORY
// ============================================================

let _stockClient: StockClient | null = null;

export function getStockClient(config?: Partial<StockClientConfig>): StockClient {
  if (!_stockClient) {
    _stockClient = new StockClient({
      // Usar proxy de Next.js para evitar CORS
      baseUrl: config?.baseUrl || '/api/vessel',
      adapter: config?.adapter || 'local',
    });
  }
  return _stockClient;
}

export function crearStockClient(config: StockClientConfig): StockClient {
  return new StockClient(config);
}

export function resetStockClient(): void {
  _stockClient = null;
}
