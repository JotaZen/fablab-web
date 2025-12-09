/**
 * Vessel API - Locations Client
 */

import type {
  Locacion,
  LocacionConHijos,
  CrearLocacionDTO,
  ActualizarLocacionDTO,
} from '../../domain/entities/location';
import type { LocacionesPort } from '../../domain/ports/locations.port';
import type { ApiLocation } from './vessel.types';
import { apiToLocacion } from './vessel.mappers';
import { VesselBaseClient, extractData, type ApiListResponse } from './base.client';

/** Construye árbol de locaciones */
export function construirArbol(locaciones: Locacion[], padreId?: string): LocacionConHijos[] {
  return locaciones
    .filter(loc => loc.padreId === padreId)
    .map(loc => ({
      ...loc,
      hijos: loc.tipo === 'warehouse'
        ? construirArbol(locaciones, loc.id)
        : [],
    }));
}

export class LocationClient extends VesselBaseClient implements LocacionesPort {

  async listar(): Promise<Locacion[]> {
    const response = await this.get<ApiListResponse<ApiLocation> | ApiLocation[]>('/api/v1/locations/read');
    return extractData(response).map(apiToLocacion);
  }

  async obtener(id: string): Promise<Locacion | null> {
    try {
      const response = await this.get<{ data: ApiLocation } | ApiLocation>(`/api/v1/locations/show/${id}`);
      const data = 'data' in response ? response.data : response;
      return apiToLocacion(data);
    } catch {
      return null;
    }
  }

  async crear(dto: CrearLocacionDTO): Promise<Locacion> {
    // Validar que storage_unit no sea padre
    if (dto.padreId) {
      const padre = await this.obtener(dto.padreId);
      if (padre && padre.tipo === 'storage_unit') {
        throw new Error('Una unidad de almacenamiento no puede tener hijos');
      }
    }

    const response = await this.post<{ data: ApiLocation } | ApiLocation>('/api/v1/locations/create', {
      name: dto.nombre,
      type: dto.tipo,
      parent_id: dto.padreId || null,
      address_id: dto.addressId || null,
      description: dto.descripcion || null,
    });

    const data = 'data' in response ? response.data : response;
    return apiToLocacion(data);
  }

  async actualizar(id: string, dto: ActualizarLocacionDTO): Promise<Locacion> {
    const response = await this.put<{ data: ApiLocation } | ApiLocation>(`/api/v1/locations/update/${id}`, {
      name: dto.nombre,
      description: dto.descripcion,
      address_id: dto.addressId,
    });

    const data = 'data' in response ? response.data : response;
    return apiToLocacion(data);
  }

  async eliminar(id: string): Promise<void> {
    await this.delete(`/api/v1/locations/delete/${id}`);
  }

  async listarLocaciones(): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.tipo === 'warehouse');
  }

  async listarUnidades(): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.tipo === 'storage_unit');
  }

  async obtenerHijos(padreId: string): Promise<Locacion[]> {
    const todas = await this.listar();
    return todas.filter(loc => loc.padreId === padreId);
  }

  async obtenerArbol(): Promise<LocacionConHijos[]> {
    const todas = await this.listar();
    return construirArbol(todas, undefined);
  }

  async obtenerRuta(id: string): Promise<Locacion[]> {
    const todas = await this.listar();
    const ruta: Locacion[] = [];

    let actual = todas.find(loc => loc.id === id);
    while (actual) {
      ruta.unshift(actual);
      actual = actual.padreId
        ? todas.find(loc => loc.id === actual!.padreId)
        : undefined;
    }

    return ruta;
  }
}

// === SINGLETON ===

let _instance: LocationClient | null = null;

export function getLocationClient(): LocationClient {
  if (!_instance) {
    _instance = new LocationClient();
  }
  return _instance;
}

export function resetLocationClient(): void {
  _instance = null;
}
