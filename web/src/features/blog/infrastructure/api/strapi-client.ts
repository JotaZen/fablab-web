/**
 * Cliente Strapi usando Fetch nativo
 * 
 * Simplifica la comunicación con Strapi CMS para blog, páginas y media.
 * Compatible con cualquier configuración de TypeScript.
 */

// Tipos de Strapi
export interface StrapiImage {
  id: number;
  name: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
}

export interface StrapiAuthor {
  id: string;
  username: string;
  email: string;
  avatar?: StrapiImage;
}

export interface StrapiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface StrapiPost {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover?: StrapiImage;
  author?: StrapiAuthor;
  categories?: StrapiCategory[];
  tags?: string[];
  views?: number;
  template?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiPage {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  template?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaImage?: StrapiImage;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiTechnology {
  id: string;
  documentId?: string;
  titulo: string;
  slug?: string;
  subtitulo?: string;
  descripcion?: string;
  areaTrabajo?: string;
  nivelCertificacion?: number | null;
  materiales?: string[];
  caracteristicas?: string;
  imagenes?: StrapiImage[];
}

export interface StrapiTeamMember {
  id: string;
  documentId?: string;
  nombre: string;
  slug?: string;
  cargo?: string;
  especialidad?: string;
  tipo?: string;
  carrera?: string;
  formacion?: string;
  bio?: string;
  experiencia?: string;
  foto?: StrapiImage | null;
}

export interface StrapiProject {
  id: string;
  documentId?: string;
  titulo?: string;
  subtitulo?: string;
  anio?: number | null;
  objetivo?: string;
  problema?: string;
  proceso?: string;
  tecnologias?: StrapiTechnology[];
  equipo?: StrapiTeamMember[];
  portada?: StrapiImage[];
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Configuración del cliente
export interface StrapiClientConfig {
  baseURL?: string;
  token?: string;
}

/**
 * Cliente HTTP base para Strapi
 */
class StrapiHttpClient {
  private baseURL: string;
  private token?: string;

  constructor(config?: StrapiClientConfig) {
    // Route through Next.js proxy by default to avoid exposing Strapi directly from el navegador.
    this.baseURL =
      config?.baseURL ||
      process.env.NEXT_PUBLIC_STRAPI_PROXY ||
      '/api/strapi';
    this.token = config?.token || process.env.STRAPI_API_TOKEN;
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

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      // Convertir params a query string de Strapi
      const qs = this.buildQueryString(params);
      url.search = qs;
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(error.error?.message || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(error.error?.message || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(error.error?.message || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(error.error?.message || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  async upload(file: File, options?: { folder?: string; caption?: string; alternativeText?: string }): Promise<StrapiImage[]> {
    const formData = new FormData();
    formData.append('files', file);
    
    if (options) {
      formData.append('fileInfo', JSON.stringify({
        folder: options.folder,
        caption: options.caption,
        alternativeText: options.alternativeText,
      }));
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Error al subir archivo');
    }

    return res.json();
  }

  private buildQueryString(params: Record<string, unknown>, prefix = ''): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (typeof value === 'object' && !Array.isArray(value)) {
        parts.push(this.buildQueryString(value as Record<string, unknown>, fullKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            parts.push(this.buildQueryString(item as Record<string, unknown>, `${fullKey}[${index}]`));
          } else {
            parts.push(`${fullKey}[${index}]=${encodeURIComponent(String(item))}`);
          }
        });
      } else {
        parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
      }
    }

    return parts.filter(Boolean).join('&');
  }
}

/**
 * Crea y configura el cliente de Strapi
 */
export function createStrapiClient(config?: StrapiClientConfig) {
  const http = new StrapiHttpClient(config);

  return {
    /**
     * Posts del blog
     */
    posts: {
      /**
       * Listar posts con filtros
       */
      async find(params?: {
        page?: number;
        pageSize?: number;
        search?: string;
        category?: string;
        status?: 'draft' | 'published';
        sort?: string;
      }): Promise<StrapiListResponse<StrapiPost>> {
        const queryParams: Record<string, unknown> = {
          populate: '*',
          pagination: {
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
          },
        };

        // Filtros
        const filters: Record<string, unknown> = {};
        
        if (params?.search) {
          filters['$or'] = [
            { title: { '$containsi': params.search } },
            { content: { '$containsi': params.search } },
          ];
        }
        
        if (params?.category) {
          filters['categories'] = { slug: { '$eq': params.category } };
        }

        if (params?.status === 'draft') {
          queryParams['publicationState'] = 'preview';
          filters['publishedAt'] = { '$null': true };
        } else if (params?.status === 'published') {
          filters['publishedAt'] = { '$notNull': true };
        }

        if (Object.keys(filters).length > 0) {
          queryParams['filters'] = filters;
        }

        // Ordenamiento
        queryParams['sort'] = params?.sort || 'publishedAt:desc';

        return http.get('/posts', queryParams);
      },

      /**
       * Obtener un post por documentId o slug
       */
      async findOne(idOrSlug: string): Promise<StrapiResponse<StrapiPost>> {
        // Si parece un documentId (largo), buscar directo
        if (idOrSlug.length > 20) {
          return http.get(`/posts/${idOrSlug}`, { populate: '*' });
        }

        // Buscar por slug
        const result = await http.get<StrapiListResponse<StrapiPost>>('/posts', {
          filters: { slug: { '$eq': idOrSlug } },
          populate: '*',
        });

        if (!result.data || result.data.length === 0) {
          throw new Error('Post no encontrado');
        }

        return { data: result.data[0] };
      },

      /**
       * Crear un nuevo post
       */
      async create(data: {
        title: string;
        content: string;
        excerpt?: string;
        cover?: number;
        categories?: string[];
        tags?: string[];
        template?: string;
      }): Promise<StrapiResponse<StrapiPost>> {
        return http.post('/posts', {
          ...data,
          slug: slugify(data.title),
        });
      },

      /**
       * Actualizar un post
       */
      async update(documentId: string, data: Partial<{
        title: string;
        content: string;
        excerpt?: string;
        cover?: number;
        categories?: string[];
        tags?: string[];
        template?: string;
      }>): Promise<StrapiResponse<StrapiPost>> {
        const updateData = { ...data };
        if (data.title) {
          (updateData as Record<string, unknown>)['slug'] = slugify(data.title);
        }
        return http.put(`/posts/${documentId}`, updateData);
      },

      /**
       * Publicar un post
       */
      async publish(documentId: string): Promise<StrapiResponse<StrapiPost>> {
        return http.put(`/posts/${documentId}`, {
          publishedAt: new Date().toISOString(),
        });
      },

      /**
       * Despublicar un post
       */
      async unpublish(documentId: string): Promise<StrapiResponse<StrapiPost>> {
        return http.put(`/posts/${documentId}`, {
          publishedAt: null,
        });
      },

      /**
       * Eliminar un post
       */
      async delete(documentId: string): Promise<StrapiResponse<StrapiPost>> {
        return http.delete(`/posts/${documentId}`);
      },
    },

    /**
     * Páginas estáticas
     */
    pages: {
      async find(params?: { page?: number; pageSize?: number }): Promise<StrapiListResponse<StrapiPage>> {
        return http.get('/pages', {
          populate: '*',
          pagination: {
            page: params?.page || 1,
            pageSize: params?.pageSize || 50,
          },
        });
      },

      async findOne(idOrSlug: string): Promise<StrapiResponse<StrapiPage>> {
        if (idOrSlug.length > 20) {
          return http.get(`/pages/${idOrSlug}`, { populate: '*' });
        }

        const result = await http.get<StrapiListResponse<StrapiPage>>('/pages', {
          filters: { slug: { '$eq': idOrSlug } },
          populate: '*',
        });

        if (!result.data || result.data.length === 0) {
          throw new Error('Página no encontrada');
        }

        return { data: result.data[0] };
      },

      async create(data: { title: string; content: string; template?: string }): Promise<StrapiResponse<StrapiPage>> {
        return http.post('/pages', {
          ...data,
          slug: slugify(data.title),
        });
      },

      async update(documentId: string, data: Partial<{ title: string; content: string; template?: string }>): Promise<StrapiResponse<StrapiPage>> {
        return http.put(`/pages/${documentId}`, data);
      },

      async delete(documentId: string): Promise<StrapiResponse<StrapiPage>> {
        return http.delete(`/pages/${documentId}`);
      },
    },

    /**
     * Categorías
     */
    categories: {
      async find(): Promise<StrapiListResponse<StrapiCategory>> {
        return http.get('/categories', { pagination: { pageSize: 100 } });
      },

      async create(data: { name: string; description?: string }): Promise<StrapiResponse<StrapiCategory>> {
        return http.post('/categories', {
          ...data,
          slug: slugify(data.name),
        });
      },
    },

    /**
     * Tecnologías
     */
    technologies: {
      async findAll(): Promise<StrapiListResponse<StrapiTechnology>> {
        const res = await http.get<any>('/tecnologias', {
          populate: '*',
          pagination: { page: 1, pageSize: 200 },
          sort: 'updatedAt:desc',
        });
        return {
          data: (res.data || []).map((item: any) => ({ id: String(item.id), ...(item.attributes || {}) })),
          meta: res.meta,
        } as StrapiListResponse<StrapiTechnology>;
      },

      async create(data: {
        titulo: string;
        subtitulo?: string;
        descripcion?: string;
        areaTrabajo?: string;
        nivelCertificacion?: number | null;
        materiales?: string[];
        caracteristicas?: string;
        imagenIds?: number[];
      }): Promise<StrapiResponse<StrapiTechnology>> {
        return http.post('/tecnologias', {
          ...data,
          slug: slugify(data.titulo),
          imagenes: data.imagenIds,
        });
      },

      async delete(id: string | number): Promise<StrapiResponse<StrapiTechnology>> {
        return http.delete(`/tecnologias/${id}`);
      },
    },

    /**
     * Miembros de equipo
     */
    teamMembers: {
      async findAll(): Promise<StrapiListResponse<StrapiTeamMember>> {
        const res = await http.get<any>('/team-members', {
          populate: '*',
          pagination: { page: 1, pageSize: 200 },
          sort: 'orden:asc',
        });
        return {
          data: (res.data || []).map((item: any) => ({ id: String(item.id), ...(item.attributes || {}) })),
          meta: res.meta,
        } as StrapiListResponse<StrapiTeamMember>;
      },

      async create(data: {
        nombre: string;
        cargo?: string;
        especialidad?: string;
        tipo?: string;
        carrera?: string;
        formacion?: string;
        bio?: string;
        experiencia?: string;
        fotoId?: number | null;
      }): Promise<StrapiResponse<StrapiTeamMember>> {
        return http.post('/team-members', {
          ...data,
          slug: slugify(data.nombre),
          foto: data.fotoId ?? undefined,
        });
      },

      async delete(id: string | number): Promise<StrapiResponse<StrapiTeamMember>> {
        return http.delete(`/team-members/${id}`);
      },
    },

    /**
     * Proyecto (single type)
     */
    project: {
      async findOne(): Promise<StrapiResponse<StrapiProject>> {
        const res = await http.get<any>('/proyecto', { populate: '*' });
        const data = res?.data;
        const normalized = data?.attributes ? { id: String(data.id), ...(data.attributes || {}) } : data;
        return { data: normalized } as StrapiResponse<StrapiProject>;
      },

      async save(data: {
        titulo?: string;
        subtitulo?: string;
        anio?: number | null;
        objetivo?: string;
        problema?: string;
        proceso?: string;
        tecnologias?: string[];
        equipo?: string[];
        portada?: number[];
      }): Promise<StrapiResponse<StrapiProject>> {
        return http.put('/proyecto', {
          ...data,
          tecnologias: data.tecnologias,
          equipo: data.equipo,
          portada: data.portada,
        });
      },
    },

    /**
     * Archivos/Media
     */
    files: {
      async find(params?: { page?: number; pageSize?: number; mime?: string }): Promise<StrapiImage[]> {
        const queryParams: Record<string, unknown> = {};
        
        if (params?.mime) {
          queryParams['filters'] = { mime: { '$contains': params.mime } };
        }
        
        return http.get('/upload/files', queryParams);
      },

      async findOne(id: number): Promise<StrapiImage> {
        return http.get(`/upload/files/${id}`);
      },

      /**
       * Subir un archivo
       */
      async upload(file: File, options?: { folder?: string; caption?: string; alternativeText?: string }): Promise<StrapiImage[]> {
        return http.upload(file, options);
      },

      async delete(id: number): Promise<StrapiImage> {
        return http.delete(`/upload/files/${id}`);
      },
    },
  };
}

/**
 * Convierte texto a slug URL-friendly
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Singleton
let _strapiClient: ReturnType<typeof createStrapiClient> | null = null;

export function getStrapiClient(config?: StrapiClientConfig) {
  if (!_strapiClient) {
    _strapiClient = createStrapiClient(config);
  }
  return _strapiClient;
}

export function resetStrapiClient() {
  _strapiClient = null;
}

// Export types for external use
export type StrapiClient = ReturnType<typeof createStrapiClient>;
