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
    // El servidor tiene límite máximo de 100 por página, traer todas las páginas
    const perPage = 100;
    let allItems: ApiItem[] = [];
    let page = 1;
    let hasMore = true;
    let totalCount = 0;

    while (hasMore) {
      const response = await this.get<ApiListResponse<ApiItem> | ApiItem[]>('/api/v1/items/read', {
        params: {
          status: filtros?.estado,
          search: filtros?.busqueda,
          page: page,
          per_page: perPage,
        },
      });

      const data = extractData(response).filter(item => item?.id);
      allItems = allItems.concat(data);

      // Verificar si hay más páginas
      if (Array.isArray(response)) {
        hasMore = false;
        totalCount = allItems.length;
      } else {
        const lastPage = response.last_page || 1;
        totalCount = response.total || allItems.length;
        hasMore = page < lastPage;
        page++;
      }
    }

    return {
      items: allItems.map(apiToItem),
      total: totalCount,
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
