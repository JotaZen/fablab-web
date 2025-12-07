/**
 * Vessel API - UoM Client
 */

import type { UnidadMedida, ConvertirUoMDTO, ResultadoConversion, CategoriaUoM } from '../../domain/entities/uom';
import type { UoMPort } from '../../domain/ports/uom.port';
import type { ApiMeasure, ApiConversionResult } from './vessel.types';
import { apiToUnidadMedida, apiToResultadoConversion } from './vessel.mappers';
import { VesselBaseClient, extractData, type ApiListResponse } from './base.client';

export class UoMClient extends VesselBaseClient implements UoMPort {

  async listar(): Promise<UnidadMedida[]> {
    const response = await this.get<ApiListResponse<ApiMeasure> | ApiMeasure[]>('/api/v1/uom/measures/read');
    return extractData(response).map(apiToUnidadMedida);
  }

  async listarPorCategoria(categoria: CategoriaUoM): Promise<UnidadMedida[]> {
    const todas = await this.listar();
    return todas.filter(u => u.categoria === categoria);
  }

  async obtener(id: string): Promise<UnidadMedida | null> {
    try {
      const data = await this.get<ApiMeasure>(`/api/v1/uom/measures/show/${id}`);
      return apiToUnidadMedida(data);
    } catch {
      return null;
    }
  }

  async obtenerPorCodigo(codigo: string): Promise<UnidadMedida | null> {
    return this.obtener(codigo);
  }

  async convertir(dto: ConvertirUoMDTO): Promise<ResultadoConversion> {
    const response = await this.post<ApiConversionResult>('/api/v1/uom/measures/convert', {
      from: dto.desde,
      to: dto.hasta,
      value: dto.valor,
    });
    return apiToResultadoConversion(response);
  }
}

// === SINGLETON ===

let _instance: UoMClient | null = null;

export function getUoMClient(): UoMClient {
  if (!_instance) {
    _instance = new UoMClient();
  }
  return _instance;
}

export function resetUoMClient(): void {
  _instance = null;
}
