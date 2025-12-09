/**
 * Cliente de Blog para Strapi CMS
 */

import type { Post, PostsPaginados, FiltrosPosts, PostInput } from '../../domain/entities';
import type { StrapiPostsResponse, StrapiPostResponse, StrapiPostInput } from './types';
import { strapiToPost, strapiToPosts, postInputToStrapi } from './adapters';
import { POSTS_POR_PAGINA } from '../../domain/constants';

export interface BlogClientConfig {
  baseUrl: string;
  token?: string;
}

export class BlogClient {
  private baseUrl: string;
  private token?: string;

  constructor(config: BlogClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Check if we're using the internal proxy (paths don't need /api prefix)
  private isProxy(): boolean {
    return !this.baseUrl.startsWith('http');
  }

  private getApiPath(path: string): string {
    // If using proxy, don't add /api prefix (proxy adds it)
    // If direct to Strapi, add /api prefix
    return this.isProxy() ? `${this.baseUrl}${path}` : `${this.baseUrl}/api${path}`;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || `Error ${res.status}`);
    }
    return res.json();
  }

  /** Construye query params para Strapi */
  private buildQueryParams(filtros?: FiltrosPosts): URLSearchParams {
    const params = new URLSearchParams();

    // Paginación
    params.set('pagination[page]', String(filtros?.pagina || 1));
    params.set('pagination[pageSize]', String(filtros?.porPagina || POSTS_POR_PAGINA));

    // Populate relaciones
    params.set('populate', '*');

    // Filtros
    if (filtros?.busqueda) {
      params.set('filters[$or][0][title][$containsi]', filtros.busqueda);
      params.set('filters[$or][1][content][$containsi]', filtros.busqueda);
    }

    if (filtros?.categoria) {
      params.set('filters[categories][slug][$eq]', filtros.categoria);
    }

    if (filtros?.estado === 'publicado') {
      params.set('filters[publishedAt][$notNull]', 'true');
    } else if (filtros?.estado === 'borrador') {
      params.set('publicationState', 'preview');
      params.set('filters[publishedAt][$null]', 'true');
    }

    // Ordenamiento
    const ordenarPor = filtros?.ordenarPor || 'fecha';
    const orden = filtros?.orden || 'desc';
    const sortField = ordenarPor === 'fecha' ? 'publishedAt' :
      ordenarPor === 'vistas' ? 'views' : 'title';
    params.set('sort', `${sortField}:${orden}`);

    return params;
  }

  // ==================== POSTS ====================

  /** Obtiene posts con filtros y paginación */
  async getPosts(filtros?: FiltrosPosts): Promise<PostsPaginados> {
    const params = this.buildQueryParams(filtros);
    const url = `${this.getApiPath('/posts')}?${params}`;

    const res = await fetch(url, { headers: this.getHeaders() });
    const data = await this.handleResponse<StrapiPostsResponse>(res);

    return {
      posts: strapiToPosts(data.data),
      total: data.meta.pagination.total,
      pagina: data.meta.pagination.page,
      porPagina: data.meta.pagination.pageSize,
      totalPaginas: data.meta.pagination.pageCount,
    };
  }

  /** Obtiene un post por ID o slug */
  async getPost(idOrSlug: string): Promise<Post> {
    // Primero intentar por ID
    const isNumeric = /^\d+$/.test(idOrSlug);

    if (isNumeric) {
      const res = await fetch(
        `${this.getApiPath(`/posts/${idOrSlug}`)}?populate=*`,
        { headers: this.getHeaders() }
      );
      const data = await this.handleResponse<StrapiPostResponse>(res);
      return strapiToPost(data.data);
    }

    // Buscar por slug
    const params = new URLSearchParams();
    params.set('filters[slug][$eq]', idOrSlug);
    params.set('populate', '*');

    const res = await fetch(
      `${this.getApiPath('/posts')}?${params}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse<StrapiPostsResponse>(res);

    if (data.data.length === 0) {
      throw new Error('Post no encontrado');
    }

    return strapiToPost(data.data[0]);
  }

  /** Obtiene posts recientes */
  async getPostsRecientes(limite = 5): Promise<Post[]> {
    const result = await this.getPosts({
      estado: 'publicado',
      ordenarPor: 'fecha',
      orden: 'desc',
      porPagina: limite,
    });
    return result.posts;
  }

  /** Obtiene posts populares */
  async getPostsPopulares(limite = 5): Promise<Post[]> {
    const result = await this.getPosts({
      estado: 'publicado',
      ordenarPor: 'vistas',
      orden: 'desc',
      porPagina: limite,
    });
    return result.posts;
  }

  /** Crea un nuevo post */
  async createPost(input: PostInput): Promise<Post> {
    const strapiInput = postInputToStrapi(input);

    const res = await fetch(`${this.getApiPath('/posts')}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ data: strapiInput }),
    });

    const data = await this.handleResponse<StrapiPostResponse>(res);
    return strapiToPost(data.data);
  }

  /** Actualiza un post */
  async updatePost(id: string, input: Partial<PostInput>): Promise<Post> {
    const strapiInput: Partial<StrapiPostInput> = {};
    if (input.titulo) strapiInput.title = input.titulo;
    if (input.contenido) strapiInput.content = input.contenido;
    if (input.extracto) strapiInput.excerpt = input.extracto;
    if (input.etiquetas) strapiInput.tags = input.etiquetas;

    const res = await fetch(`${this.getApiPath(`/posts/${id}`)}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ data: strapiInput }),
    });

    const data = await this.handleResponse<StrapiPostResponse>(res);
    return strapiToPost(data.data);
  }

  /** Publica un post */
  async publishPost(id: string): Promise<Post> {
    const res = await fetch(`${this.getApiPath(`/posts/${id}`)}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
    });

    const data = await this.handleResponse<StrapiPostResponse>(res);
    return strapiToPost(data.data);
  }

  /** Despublica un post */
  async unpublishPost(id: string): Promise<Post> {
    const res = await fetch(`${this.getApiPath(`/posts/${id}`)}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ data: { publishedAt: null } }),
    });

    const data = await this.handleResponse<StrapiPostResponse>(res);
    return strapiToPost(data.data);
  }

  /** Elimina un post */
  async deletePost(id: string): Promise<void> {
    const res = await fetch(`${this.getApiPath(`/posts/${id}`)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error('Error al eliminar post');
    }
  }
}

// Singleton
let clientInstance: BlogClient | null = null;

export function getBlogClient(config?: BlogClientConfig): BlogClient {
  if (!clientInstance && config) {
    clientInstance = new BlogClient(config);
  }
  if (!clientInstance) {
    clientInstance = new BlogClient({
      baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    });
  }
  return clientInstance;
}

// Instancia pre-configurada para uso directo
export const blogClient = getBlogClient();
