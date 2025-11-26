/**
 * Cliente de Unidades de Medida (UoM) para la API de Vessel
 * 
 * Maneja las peticiones HTTP para unidades de medida y conversiones
 */

import type {
  UnidadMedida,
  ConvertirUoMDTO,
  ResultadoConversion,
} from '../../domain/entities';

import type {
  ApiMeasure,
  ApiConvertMeasure,
  ApiConversionResult,
  ApiListResponse,
} from './types';

// ============================================================
// ADAPTERS - Transforman entre API (snake_case) y Domain (camelCase)
// ============================================================

function apiToUnidadMedida(api: ApiMeasure): UnidadMedida {
  return {
    id: api.id,
    codigo: api.code,
    nombre: api.name,
    simbolo: api.symbol,
    categoria: api.category,
    esBase: api.is_base,
    factorConversion: api.conversion_factor,
  };
}

function convertirUoMToApi(dto: ConvertirUoMDTO): ApiConvertMeasure {
  return {
    from: dto.desde,
    to: dto.hasta,
    value: dto.valor,
  };
}

function apiToResultadoConversion(api: ApiConversionResult): ResultadoConversion {
  return {
    valorOriginal: api.original_value,
    valorConvertido: api.converted_value,
    unidadOrigen: api.from_unit,
    unidadDestino: api.to_unit,
  };
}

// ============================================================
// CONFIGURACIÓN DEL CLIENTE
// ============================================================

export interface UoMClientConfig {
  baseUrl: string;
}

// ============================================================
// UOM CLIENT
// ============================================================

export class UoMClient {
  private baseUrl: string;

  constructor(config: UoMClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.text().catch(() => 'Error desconocido');
      throw new Error(`Error ${res.status}: ${error}`);
    }
    return res.json();
  }

  // ============================================================
  // UNIDADES DE MEDIDA
  // ============================================================

  /** Lista todas las unidades de medida disponibles */
  async listarUnidades(): Promise<UnidadMedida[]> {
    const url = `${this.baseUrl}/v1/uom/measures/read`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const response = await this.handleResponse<ApiListResponse<ApiMeasure> | ApiMeasure[]>(res);
    
    const data = Array.isArray(response) ? response : response.data;
    return data.map(apiToUnidadMedida);
  }

  /** Obtiene una unidad de medida por ID o código */
  async obtenerUnidad(idOCodigo: string): Promise<UnidadMedida | null> {
    try {
      const url = `${this.baseUrl}/v1/uom/measures/show/${idOCodigo}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const data = await this.handleResponse<ApiMeasure>(res);
      return apiToUnidadMedida(data);
    } catch {
      return null;
    }
  }

  /** Convierte un valor entre dos unidades de medida */
  async convertir(datos: ConvertirUoMDTO): Promise<ResultadoConversion> {
    const url = `${this.baseUrl}/v1/uom/measures/convert`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(convertirUoMToApi(datos)),
    });
    const response = await this.handleResponse<ApiConversionResult>(res);
    return apiToResultadoConversion(response);
  }

  // ============================================================
  // HELPERS
  // ============================================================

  /** Lista unidades por categoría */
  async listarPorCategoria(categoria: string): Promise<UnidadMedida[]> {
    const todas = await this.listarUnidades();
    return todas.filter(u => u.categoria === categoria);
  }

  /** Obtiene la unidad base de una categoría */
  async obtenerUnidadBase(categoria: string): Promise<UnidadMedida | null> {
    const unidades = await this.listarPorCategoria(categoria);
    return unidades.find(u => u.esBase) || null;
  }
}

// ============================================================
// FACTORY
// ============================================================

let _uomClient: UoMClient | null = null;

export function getUoMClient(config?: Partial<UoMClientConfig>): UoMClient {
  if (!_uomClient) {
    _uomClient = new UoMClient({
      // Usar proxy de Next.js para evitar CORS
      baseUrl: config?.baseUrl || '/api/vessel',
    });
  }
  return _uomClient;
}

export function crearUoMClient(config: UoMClientConfig): UoMClient {
  return new UoMClient(config);
}

export function resetUoMClient(): void {
  _uomClient = null;
}
