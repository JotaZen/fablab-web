/**
 * Cliente de Blog para Payload CMS
 * 
 * Este cliente usa la API local de Payload CMS para operaciones CRUD de posts.
 * Funciona tanto en el servidor (Local API) como en el cliente (REST API).
 */

import type { Post, PostsPaginados, FiltrosPosts, PostInput, Categoria } from '../../domain/entities';
import type { PayloadPost, PayloadMedia, PayloadUser, PayloadCategory } from './types';

const POSTS_POR_PAGINA = 10;

export interface PayloadBlogClientConfig {
    baseUrl?: string;
    token?: string;
}

export class PayloadBlogClient {
    private baseUrl: string;
    private token?: string;

    constructor(config: PayloadBlogClientConfig = {}) {
        this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
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

    private async handleResponse<T>(res: Response): Promise<T> {
        if (!res.ok) {
            const error = await res.json().catch(() => ({ errors: [{ message: 'Error desconocido' }] }));
            throw new Error(error.errors?.[0]?.message || `Error ${res.status}`);
        }
        return res.json();
    }

    /** Convierte un post de Payload a dominio */
    private payloadToPost(payloadPost: PayloadPost): Post {
        const featuredImage = payloadPost.featuredImage as PayloadMedia | undefined;
        const author = payloadPost.author as PayloadUser | undefined;
        const categories = payloadPost.categories as PayloadCategory[] | undefined;

        return {
            id: String(payloadPost.id),
            titulo: payloadPost.title,
            slug: payloadPost.slug || '',
            contenido: this.serializeRichText(payloadPost.content),
            extracto: payloadPost.excerpt,
            imagenPortada: featuredImage?.url,
            imagenDestacada: featuredImage ? {
                id: String(featuredImage.id),
                url: featuredImage.url,
                filename: featuredImage.filename,
                alt: featuredImage.alt,
                width: featuredImage.width,
                height: featuredImage.height,
            } : undefined,
            autor: author ? {
                id: String(author.id),
                nombre: author.name || author.email,
                avatar: (author.avatar as PayloadMedia)?.url,
                bio: author.bio,
            } : undefined,
            categorias: categories?.map(cat => ({
                id: String(cat.id),
                nombre: cat.name,
                slug: cat.slug || '',
                descripcion: cat.description,
            })),
            etiquetas: payloadPost.tags?.map((t: { tag: string }) => t.tag).filter(Boolean) as string[],
            vistas: payloadPost.views || 0,
            estado: payloadPost.status === 'published' ? 'publicado' :
                payloadPost.status === 'archived' ? 'archivado' : 'borrador',
            fechaPublicacion: payloadPost.publishedAt || undefined,
            fechaCreacion: payloadPost.createdAt,
            fechaActualizacion: payloadPost.updatedAt,
        };
    }

    /** Serializa el contenido Rich Text de Lexical a HTML/Markdown */
    private serializeRichText(content: unknown): string {
        if (!content) return '';
        if (typeof content === 'string') return content;

        try {
            const lexicalContent = content as { root?: { children?: unknown[] } };
            if (lexicalContent.root?.children) {
                return this.serializeLexicalNodes(lexicalContent.root.children);
            }
            return JSON.stringify(content);
        } catch {
            return '';
        }
    }

    /** Serializa nodos de Lexical a texto/markdown */
    private serializeLexicalNodes(nodes: unknown[]): string {
        return nodes.map(node => {
            const n = node as { type?: string; text?: string; children?: unknown[]; tag?: string; format?: number };

            if (n.type === 'text') {
                let text = n.text || '';
                if (n.format) {
                    if (n.format & 1) text = `**${text}**`;
                    if (n.format & 2) text = `*${text}*`;
                }
                return text;
            }

            if (n.type === 'paragraph' && n.children) {
                return this.serializeLexicalNodes(n.children) + '\n\n';
            }

            if (n.type === 'heading' && n.children) {
                const level = n.tag?.replace('h', '') || '1';
                const prefix = '#'.repeat(parseInt(level));
                return `${prefix} ${this.serializeLexicalNodes(n.children)}\n\n`;
            }

            if (n.type === 'list' && n.children) {
                return n.children.map(item => {
                    const itemNode = item as { children?: unknown[] };
                    return `- ${this.serializeLexicalNodes(itemNode.children || [])}`;
                }).join('\n') + '\n\n';
            }

            if (n.children) {
                return this.serializeLexicalNodes(n.children);
            }

            return '';
        }).join('');
    }

    /** Construye query params para Payload */
    private buildQueryParams(filtros?: FiltrosPosts): URLSearchParams {
        const params = new URLSearchParams();

        params.set('page', String(filtros?.pagina || 1));
        params.set('limit', String(filtros?.porPagina || POSTS_POR_PAGINA));
        params.set('depth', '2');

        if (filtros?.busqueda) {
            params.set('where[or][0][title][contains]', filtros.busqueda);
            params.set('where[or][1][excerpt][contains]', filtros.busqueda);
        }

        if (filtros?.categoria) {
            params.set('where[categories.slug][equals]', filtros.categoria);
        }

        if (filtros?.estado === 'publicado') {
            params.set('where[status][equals]', 'published');
        } else if (filtros?.estado === 'borrador') {
            params.set('where[status][equals]', 'draft');
        } else if (filtros?.estado === 'archivado') {
            params.set('where[status][equals]', 'archived');
        }

        if (filtros?.fechaInicio) {
            params.set('where[publishedAt][greater_than_equal]', filtros.fechaInicio);
        }
        if (filtros?.fechaFin) {
            params.set('where[publishedAt][less_than_equal]', filtros.fechaFin);
        }

        const ordenarPor = filtros?.ordenarPor || 'fecha';
        const orden = filtros?.orden || 'desc';
        const sortField = ordenarPor === 'fecha' ? 'publishedAt' :
            ordenarPor === 'vistas' ? 'views' : 'title';
        params.set('sort', orden === 'desc' ? `-${sortField}` : sortField);

        return params;
    }

    /** Convierte Markdown a formato Lexical */
    private parseMarkdownToLexical(markdown: string): unknown {
        const paragraphs = markdown.split(/\n\n+/);

        const children = paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                return {
                    type: 'heading',
                    tag: `h${level}`,
                    children: [{ type: 'text', text: headerMatch[2] }],
                };
            }

            return {
                type: 'paragraph',
                children: [{ type: 'text', text: trimmed }],
            };
        }).filter(Boolean);

        return {
            root: {
                type: 'root',
                children,
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
            },
        };
    }

    // ==================== POSTS ====================

    async getPosts(filtros?: FiltrosPosts): Promise<PostsPaginados> {
        const params = this.buildQueryParams(filtros);
        const url = `${this.baseUrl}/api/payload/posts?${params}`;

        const res = await fetch(url, {
            headers: this.getHeaders(),
            cache: 'no-store',
        });

        const data = await this.handleResponse<{
            docs: PayloadPost[];
            totalDocs: number;
            page: number;
            limit: number;
            totalPages: number;
        }>(res);

        return {
            posts: data.docs.map(p => this.payloadToPost(p)),
            total: data.totalDocs,
            pagina: data.page,
            porPagina: data.limit,
            totalPaginas: data.totalPages,
        };
    }

    async getPost(idOrSlug: string): Promise<Post> {
        const isNumeric = /^\d+$/.test(idOrSlug);

        let url: string;
        if (isNumeric) {
            url = `${this.baseUrl}/api/payload/posts/${idOrSlug}?depth=2`;
        } else {
            url = `${this.baseUrl}/api/payload/posts?where[slug][equals]=${encodeURIComponent(idOrSlug)}&depth=2`;
        }

        const res = await fetch(url, {
            headers: this.getHeaders(),
            cache: 'no-store',
        });

        if (isNumeric) {
            const data = await this.handleResponse<PayloadPost>(res);
            return this.payloadToPost(data);
        }

        const data = await this.handleResponse<{ docs: PayloadPost[] }>(res);
        if (data.docs.length === 0) {
            throw new Error('Post no encontrado');
        }

        return this.payloadToPost(data.docs[0]);
    }

    async getPostsRecientes(limite = 5): Promise<Post[]> {
        const result = await this.getPosts({
            estado: 'publicado',
            ordenarPor: 'fecha',
            orden: 'desc',
            porPagina: limite,
        });
        return result.posts;
    }

    async getPostsPopulares(limite = 5): Promise<Post[]> {
        const result = await this.getPosts({
            estado: 'publicado',
            ordenarPor: 'vistas',
            orden: 'desc',
            porPagina: limite,
        });
        return result.posts;
    }

    async getPostsTendencia(limite = 5, dias = 30): Promise<Post[]> {
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaInicio.getDate() - dias);

        const result = await this.getPosts({
            estado: 'publicado',
            ordenarPor: 'vistas',
            orden: 'desc',
            porPagina: limite,
            fechaInicio: fechaInicio.toISOString(),
        });
        return result.posts;
    }

    async createPost(input: PostInput): Promise<Post> {
        const res = await fetch(`${this.baseUrl}/api/payload/posts`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                title: input.titulo,
                content: this.parseMarkdownToLexical(input.contenido),
                excerpt: input.extracto,
                featuredImage: input.featuredImageId,
                tags: input.etiquetas?.map((tag: string) => ({ tag })),
                status: input.estado === 'publicado' ? 'published' :
                    input.estado === 'archivado' ? 'archived' : 'draft',
                publishedAt: input.estado === 'publicado' ? new Date().toISOString() : null,
            }),
        });

        const data = await this.handleResponse<{ doc: PayloadPost }>(res);
        return this.payloadToPost(data.doc);
    }

    async updatePost(id: string, input: Partial<PostInput>): Promise<Post> {
        const updateData: Record<string, unknown> = {};

        if (input.titulo !== undefined) updateData.title = input.titulo;
        if (input.contenido !== undefined) updateData.content = this.parseMarkdownToLexical(input.contenido);
        if (input.extracto !== undefined) updateData.excerpt = input.extracto;
        if (input.featuredImageId !== undefined) updateData.featuredImage = input.featuredImageId;
        if (input.etiquetas !== undefined) updateData.tags = input.etiquetas.map((tag: string) => ({ tag }));

        const res = await fetch(`${this.baseUrl}/api/payload/posts/${id}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(updateData),
        });

        const data = await this.handleResponse<{ doc: PayloadPost }>(res);
        return this.payloadToPost(data.doc);
    }

    async publishPost(id: string): Promise<Post> {
        const res = await fetch(`${this.baseUrl}/api/payload/posts/${id}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
                status: 'published',
                publishedAt: new Date().toISOString(),
            }),
        });

        const data = await this.handleResponse<{ doc: PayloadPost }>(res);
        return this.payloadToPost(data.doc);
    }

    async unpublishPost(id: string): Promise<Post> {
        const res = await fetch(`${this.baseUrl}/api/payload/posts/${id}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
                status: 'draft',
                publishedAt: null,
            }),
        });

        const data = await this.handleResponse<{ doc: PayloadPost }>(res);
        return this.payloadToPost(data.doc);
    }

    async deletePost(id: string): Promise<void> {
        const res = await fetch(`${this.baseUrl}/api/payload/posts/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        if (!res.ok) {
            throw new Error('Error al eliminar post');
        }
    }

    async incrementViews(id: string): Promise<void> {
        try {
            // First get current views - race condition possible but acceptable for this use case
            const post = await this.getPost(id);
            const currentViews = post.vistas || 0;

            await fetch(`${this.baseUrl}/api/payload/posts/${id}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    views: currentViews + 1,
                }),
            });
        } catch (error) {
            console.error('Error incrementing views for post:', id, error);
        }
    }

    // ==================== CATEGORÍAS ====================

    async getCategories(): Promise<Categoria[]> {
        const res = await fetch(`${this.baseUrl}/api/payload/categories?limit=100&depth=1`, {
            headers: this.getHeaders(),
            cache: 'no-store',
        });

        const data = await this.handleResponse<{ docs: PayloadCategory[] }>(res);

        return data.docs.map((cat: PayloadCategory) => ({
            id: String(cat.id),
            nombre: cat.name,
            slug: cat.slug || '',
            descripcion: cat.description,
        }));
    }
}

// Singleton
let clientInstance: PayloadBlogClient | null = null;

export function getPayloadBlogClient(config?: PayloadBlogClientConfig): PayloadBlogClient {
    if (!clientInstance && config) {
        clientInstance = new PayloadBlogClient(config);
    }
    if (!clientInstance) {
        clientInstance = new PayloadBlogClient();
    }
    return clientInstance;
}

export function setPayloadBlogClientForTest(client: PayloadBlogClient | null): void {
    clientInstance = client;
}

export const payloadBlogClient = getPayloadBlogClient();
