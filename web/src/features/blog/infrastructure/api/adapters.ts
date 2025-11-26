/**
 * Adaptadores para transformar datos entre Strapi y Dominio
 */

import type { StrapiPost, StrapiPostInput } from './types';
import type { Post, PostInput, Autor, Categoria, EstadoPost } from '../../domain/entities';

// ==================== HELPERS ====================

function ensureString(value: unknown, defaultValue = ''): string {
  if (typeof value === 'string') return value;
  return defaultValue;
}

function toDateOrNow(value: unknown): Date {
  if (!value) return new Date();
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? new Date() : date;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function determinarEstado(publishedAt: string | undefined | null): EstadoPost {
  if (publishedAt) return 'publicado';
  return 'borrador';
}

// ==================== POST ====================

/** Convierte un post de Strapi a dominio */
export function strapiToPost(strapi: StrapiPost): Post {
  // Soportar tanto Strapi v4 (attributes) como v5 (plano)
  const attrs = strapi.attributes || (strapi as unknown as StrapiPost['attributes']);
  
  // Autor - manejar cuando no existe o viene en diferente formato
  let autor: Autor | undefined;
  try {
    if (attrs.author?.data) {
      const authorData = attrs.author.data;
      autor = {
        id: String(authorData.id),
        nombre: authorData.attributes?.username || 'Anónimo',
        avatar: authorData.attributes?.avatar?.data?.attributes?.url,
        bio: authorData.attributes?.bio,
      };
    }
  } catch {
    // Si falla el parsing del autor, dejarlo undefined
    autor = undefined;
  }

  // Categorías
  let categorias: Categoria[] = [];
  if (attrs.categories?.data) {
    categorias = attrs.categories.data.map(cat => ({
      id: String(cat.id),
      nombre: cat.attributes.name,
      slug: cat.attributes.slug,
      descripcion: cat.attributes.description,
    }));
  }

  return {
    id: String(strapi.id),
    titulo: ensureString(attrs.title, 'Sin título'),
    slug: attrs.slug || generateSlug(attrs.title || ''),
    contenido: ensureString(attrs.content),
    extracto: attrs.excerpt,
    imagenPortada: attrs.cover_image?.data?.attributes.url,
    autor,
    categorias,
    etiquetas: attrs.tags || [],
    vistas: attrs.views || 0,
    estado: determinarEstado(attrs.publishedAt),
    fechaPublicacion: attrs.publishedAt ? new Date(attrs.publishedAt) : undefined,
    fechaCreacion: toDateOrNow(attrs.createdAt),
    fechaActualizacion: toDateOrNow(attrs.updatedAt),
  };
}

/** Convierte array de posts */
export function strapiToPosts(data: StrapiPost[]): Post[] {
  return data.map(strapiToPost);
}

/** Convierte un PostInput de dominio a formato Strapi */
export function postInputToStrapi(input: PostInput): StrapiPostInput {
  return {
    title: input.titulo,
    content: input.contenido,
    slug: generateSlug(input.titulo),
    excerpt: input.extracto,
    tags: input.etiquetas,
    categories: input.categorias?.map(Number),
  };
}
