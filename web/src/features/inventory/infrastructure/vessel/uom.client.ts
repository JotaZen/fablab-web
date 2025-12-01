/**
 * Vessel API - UoM Client
 */

import type { UnidadMedida, ConvertirUoMDTO, ResultadoConversion, CategoriaUoM } from '../../domain/entities/uom';
import type { UoMPort } from '../../domain/ports/uom.port';
import type { ApiMeasure, ApiConversionResult, ApiListResponse } from './vessel.types';
import { apiToUnidadMedida, apiToResultadoConversion } from './vessel.mappers';

export interface UoMClientConfig {
  baseUrl: string;
}

export class UoMClient implements UoMPort {
  private baseUrl: string;

  constructor(config: UoMClientConfig) {
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

  async listar(): Promise<UnidadMedida[]> {
    const url = `${this.baseUrl}/v1/uom/read`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiMeasure> | ApiMeasure[]>(res);
    
    const data = Array.isArray(response) ? response : response.data;
    return data.map(apiToUnidadMedida);
  }

  async listarPorCategoria(categoria: CategoriaUoM): Promise<UnidadMedida[]> {
    const todas = await this.listar();
    return todas.filter(u => u.categoria === categoria);
  }

  async obtener(id: string): Promise<UnidadMedida | null> {
    try {
      const url = `${this.baseUrl}/v1/uom/show/${id}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiMeasure>(res);
      return apiToUnidadMedida(data);
    } catch {
      return null;
    }
  }

  async obtenerPorCodigo(codigo: string): Promise<UnidadMedida | null> {
    return this.obtener(codigo);
  }

  async convertir(dto: ConvertirUoMDTO): Promise<ResultadoConversion> {
    const url = `${this.baseUrl}/v1/uom/convert`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        from: dto.desde,
        to: dto.hasta,
        value: dto.valor,
      }),
    });
    const response = await this.handleResponse<ApiConversionResult>(res);
    return apiToResultadoConversion(response);
  }
}

// === FACTORY ===

let _uomClient: UoMClient | null = null;

export function getUoMClient(config?: Partial<UoMClientConfig>): UoMClient {
  if (!_uomClient) {
    _uomClient = new UoMClient({ baseUrl: config?.baseUrl || '/api/vessel' });
  }
  return _uomClient;
}

export function resetUoMClient(): void {
  _uomClient = null;
}
