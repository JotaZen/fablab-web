/**
 * Vessel API - Items Client
 */

import type { Item, CrearItemDTO, ActualizarItemDTO, FiltrosItem } from '../../domain/entities/item';
import type { ItemsPort } from '../../domain/ports/items.port';
import type { ApiItem, ApiListResponse } from './vessel.types';
import { apiToItem } from './vessel.mappers';

export interface ItemsClientConfig {
  baseUrl: string;
}

export class ItemsClient implements ItemsPort {
  private baseUrl: string;

  constructor(config: ItemsClientConfig) {
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

  async listar(filtros?: FiltrosItem): Promise<{ items: Item[]; total: number }> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.set('status', filtros.estado);
    if (filtros?.busqueda) params.set('search', filtros.busqueda);
    if (filtros?.pagina) params.set('page', String(filtros.pagina));
    if (filtros?.porPagina) params.set('per_page', String(filtros.porPagina));

    const queryString = params.toString();
    const url = `${this.baseUrl}/v1/items/read${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiItem> | ApiItem[]>(res);
    
    const data = Array.isArray(response) ? response : (response.data || []);
    const meta = !Array.isArray(response) ? response.meta : undefined;
    
    return {
      items: data.filter(item => item && item.id).map(apiToItem),
      total: meta?.total || data.length,
    };
  }

  async obtener(id: string): Promise<Item | null> {
    try {
      const url = `${this.baseUrl}/v1/items/show/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiItem>(res);
      return apiToItem(data);
    } catch {
      return null;
    }
  }

  async crear(dto: CrearItemDTO): Promise<Item> {
    const url = `${this.baseUrl}/v1/items/create`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: dto.nombre,
        description: dto.descripcion,
        uom_id: dto.uomId,
        notes: dto.notas,
        status: dto.estado || 'active',
        term_ids: dto.terminoIds,
      }),
    });
    const response = await this.handleResponse<ApiItem>(res);
    return apiToItem(response);
  }

  async actualizar(id: string, dto: ActualizarItemDTO): Promise<Item> {
    const url = `${this.baseUrl}/v1/items/update/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: dto.nombre,
        description: dto.descripcion,
        uom_id: dto.uomId,
        notes: dto.notas,
        status: dto.estado,
        term_ids: dto.terminoIds,
      }),
    });
    const response = await this.handleResponse<ApiItem>(res);
    return apiToItem(response);
  }

  async eliminar(id: string): Promise<void> {
    const url = `${this.baseUrl}/v1/items/delete/${id}`;
    const res = await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
    if (!res.ok) throw new Error('Error al eliminar item');
  }

  async listarActivos(): Promise<Item[]> {
    const { items } = await this.listar({ estado: 'active' });
    return items;
  }

  async buscar(termino: string): Promise<Item[]> {
    const { items } = await this.listar({ busqueda: termino });
    return items;
  }
}

// === FACTORY ===

let _itemsClient: ItemsClient | null = null;

export function getItemsClient(config?: Partial<ItemsClientConfig>): ItemsClient {
  if (!_itemsClient) {
    _itemsClient = new ItemsClient({ baseUrl: config?.baseUrl || '/api/vessel' });
  }
  return _itemsClient;
}

export function resetItemsClient(): void {
  _itemsClient = null;
}
