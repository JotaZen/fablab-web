/**
 * Constantes del módulo Blog
 */

export const ESTADOS_POST = {
  BORRADOR: 'borrador',
  PUBLICADO: 'publicado',
  ARCHIVADO: 'archivado',
} as const;

export const POSTS_POR_PAGINA = 10;

export const ORDENAR_POR = {
  FECHA: 'fecha',
  VISTAS: 'vistas',
  TITULO: 'titulo',
} as const;
