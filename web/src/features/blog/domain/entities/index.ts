/**
 * Entidades de dominio para el módulo de Blog
 */

/** Estado de publicación del post */
export type EstadoPost = 'borrador' | 'publicado' | 'archivado' | 'draft' | 'published' | 'archived';

/** Media/Imagen */
export interface Media {
  id: string;
  url?: string;
  filename?: string;
  alt?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

/** Etiqueta del post (como viene de Payload) */
export interface TagItem {
  tag?: string;
}

/** Post del blog */
export interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string | object; // Puede ser string o objeto Lexical
  extracto?: string;
  imagenPortada?: string;
  imagenDestacada?: string | Media;
  autor?: Autor;
  categorias?: Categoria[];
  etiquetas?: (string | TagItem)[];
  vistas?: number;
  estado: EstadoPost;
  fechaPublicacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Autor del post */
export interface Autor {
  id: string;
  nombre?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  email?: string;
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
  etiqueta?: string;           // Filtrar por una etiqueta específica
  etiquetas?: string[];        // Filtrar por múltiples etiquetas
  estado?: EstadoPost;
  autor?: string;
  pagina?: number;
  porPagina?: number;
  limite?: number;
  ordenarPor?: 'fecha' | 'vistas' | 'titulo';
  orden?: 'asc' | 'desc';
  fechaInicio?: string;
  fechaFin?: string;
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
  featuredImageId?: number | string;
}
