/**
 * Entidades de dominio para el módulo de Blog
 */

/** Estado de publicación del post */
export type EstadoPost = 'borrador' | 'publicado' | 'archivado';

/** Post del blog */
export interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  extracto?: string;
  imagenPortada?: string;
  autor?: Autor;
  categorias?: Categoria[];
  etiquetas?: string[];
  vistas?: number;
  estado: EstadoPost;
  fechaPublicacion?: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

/** Autor del post */
export interface Autor {
  id: string;
  nombre: string;
  avatar?: string;
  bio?: string;
}

/** Categoría de post */
export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
}

/** Filtros para listar posts */
export interface FiltrosPosts {
  busqueda?: string;
  categoria?: string;
  estado?: EstadoPost;
  autor?: string;
  pagina?: number;
  porPagina?: number;
  ordenarPor?: 'fecha' | 'vistas' | 'titulo';
  orden?: 'asc' | 'desc';
}

/** Respuesta paginada */
export interface PostsPaginados {
  posts: Post[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/** Datos para crear/actualizar post */
export interface PostInput {
  titulo: string;
  contenido: string;
  extracto?: string;
  imagenPortada?: string;
  imagenDestacada?: string;
  categorias?: string[];
  etiquetas?: string[];
  estado?: EstadoPost;
}
