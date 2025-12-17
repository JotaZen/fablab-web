/**
 * Tipos de Payload CMS para el Blog
 * 
 * Tipos que representan la estructura de datos de Payload
 */

// Tipos base de Payload
export interface PayloadMeta {
    id: number | string;
    createdAt: string;
    updatedAt: string;
}

// Usuario de Payload
export interface PayloadUser extends PayloadMeta {
    email: string;
    name?: string;
    avatar?: PayloadMedia | number;
    bio?: string;
    role: 'admin' | 'editor' | 'author';
}

// Media de Payload
export interface PayloadMedia extends PayloadMeta {
    url: string;
    alt: string;
    caption?: string;
    filename: string;
    mimeType: string;
    filesize: number;
    width?: number;
    height?: number;
    sizes?: {
        thumbnail?: { url: string; width: number; height: number };
        card?: { url: string; width: number; height: number };
        tablet?: { url: string; width: number; height: number };
    };
}

// Categoría de Payload
export interface PayloadCategory extends PayloadMeta {
    name: string;
    slug?: string;
    description?: string;
    parent?: PayloadCategory | number | null;
    icon?: string;
}

// Post de Payload
export interface PayloadPost extends PayloadMeta {
    title: string;
    slug?: string;
    excerpt?: string;
    featuredImage?: PayloadMedia | number;
    content: unknown; // Lexical rich text format
    author?: PayloadUser | number;
    categories?: (PayloadCategory | number)[];
    tags?: { tag: string }[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: string | null;
    views?: number;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
    };
}

// Respuestas de API de Payload
export interface PayloadPaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

export interface PayloadSingleResponse<T> {
    doc: T;
    message: string;
}

export interface PayloadDeleteResponse {
    id: number | string;
    message: string;
}

// Query types para Payload
export interface PayloadQuery {
    where?: Record<string, unknown>;
    sort?: string;
    limit?: number;
    page?: number;
    depth?: number;
}

// Input types para crear/actualizar
export interface PayloadPostInput {
    title: string;
    content: unknown;
    excerpt?: string;
    featuredImage?: number;
    categories?: number[];
    tags?: { tag: string }[];
    status?: 'draft' | 'published' | 'archived';
    publishedAt?: string | null;
}

export interface PayloadCategoryInput {
    name: string;
    slug?: string;
    description?: string;
    parent?: number | null;
    icon?: string;
}
