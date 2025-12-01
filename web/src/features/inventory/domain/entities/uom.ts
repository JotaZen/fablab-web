/**
 * UoM - Unidades de medida
 */

// === TIPOS ===

export type CategoriaUoM = 'length' | 'weight' | 'volume' | 'area' | 'time' | 'quantity' | 'other';

// === ENTIDADES ===

/** Unidad de medida */
export interface UnidadMedida {
  id: string;
  codigo: string;
  nombre: string;
  simbolo: string;
  categoria: CategoriaUoM;
  esBase: boolean;
  factorConversion: number;
}

// === DTOs ===

export interface ConvertirUoMDTO {
  desde: string;
  hasta: string;
  valor: number;
}

export interface ResultadoConversion {
  valorOriginal: number;
  valorConvertido: number;
  unidadOrigen: string;
  unidadDestino: string;
}
