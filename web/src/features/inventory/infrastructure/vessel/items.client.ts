/**
 * Vessel API - Items Client
 */

import type { Item, CrearItemDTO, ActualizarItemDTO, FiltrosItem } from '../../domain/entities/item';
import type { ItemsPort } from '../../domain/ports/items.port';
import type { ApiItem } from './vessel.types';
import { apiToItem } from './vessel.mappers';
import { VesselBaseClient, extractData, extractMeta, type ApiListResponse } from './base.client';

export class ItemsClient extends VesselBaseClient implements ItemsPort {

  async listar(filtros?: FiltrosItem): Promise<{ items: Item[]; total: number }> {
    const response = await this.get<ApiListResponse<ApiItem> | ApiItem[]>('/api/v1/items/read', {
      params: {
        status: filtros?.estado,
        search: filtros?.busqueda,
        page: filtros?.pagina,
        per_page: filtros?.porPagina,
      },
    });

    const data = extractData(response).filter(item => item?.id);
    const meta = extractMeta(response);

    return {
      items: data.map(apiToItem),
      total: meta?.total || data.length,
    };
  }

  async obtener(id: string): Promise<Item | null> {
    try {
      const data = await this.get<ApiItem>(`/api/v1/items/show/${id}`);
      return apiToItem(data);
    } catch {
      return null;
    }
  }

  async crear(dto: CrearItemDTO): Promise<Item> {
    const response = await this.post<ApiItem>('/api/v1/items/create', {
      name: dto.nombre,
      description: dto.descripcion,
      uom_id: dto.uomId,
      notes: dto.notas,
      status: dto.estado || 'active',
      term_ids: dto.terminoIds,
    });
    return apiToItem(response);
  }

  async actualizar(id: string, dto: ActualizarItemDTO): Promise<Item> {
    const response = await this.put<ApiItem>(`/api/v1/items/update/${id}`, {
      name: dto.nombre,
      description: dto.descripcion,
      uom_id: dto.uomId,
      notes: dto.notas,
      status: dto.estado,
      term_ids: dto.terminoIds,
    });
    return apiToItem(response);
  }

  async eliminar(id: string): Promise<void> {
    await this.delete(`/api/v1/items/delete/${id}`);
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

// === SINGLETON ===

let _instance: ItemsClient | null = null;

export function getItemsClient(): ItemsClient {
  if (!_instance) {
    _instance = new ItemsClient();
  }
  return _instance;
}

export function resetItemsClient(): void {
  _instance = null;
}
