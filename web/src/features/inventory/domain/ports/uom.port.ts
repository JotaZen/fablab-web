/**
 * UoM Port - Interface para repositorio de unidades de medida
 */

import type { UnidadMedida, ConvertirUoMDTO, ResultadoConversion, CategoriaUoM } from '../entities/uom';

/** Puerto para gestión de unidades de medida */
export interface UoMPort {
  listar(): Promise<UnidadMedida[]>;
  listarPorCategoria(categoria: CategoriaUoM): Promise<UnidadMedida[]>;
  obtener(id: string): Promise<UnidadMedida | null>;
  obtenerPorCodigo(codigo: string): Promise<UnidadMedida | null>;
  convertir(dto: ConvertirUoMDTO): Promise<ResultadoConversion>;
}
