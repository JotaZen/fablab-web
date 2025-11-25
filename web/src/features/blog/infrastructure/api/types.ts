/**
 * Tipos de la API de Strapi para Posts
 */

/** Post como viene de Strapi */
export interface StrapiPost {
  id: number;
  attributes: {
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    cover_image?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    author?: {
      data?: {
        id: number;
        attributes: {
          username: string;
          avatar?: {
            data?: {
              attributes: { url: string };
            };
          };
          bio?: string;
        };
      };
    };
    categories?: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
          slug: string;
          description?: string;
        };
      }>;
    };
    tags?: string[];
    views?: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}

/** Respuesta de lista de Strapi */
export interface StrapiPostsResponse {
  data: StrapiPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/** Respuesta de un solo post */
export interface StrapiPostResponse {
  data: StrapiPost;
}

/** Datos para crear post en Strapi */
export interface StrapiPostInput {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  cover_image?: number; // Media ID
  categories?: number[];
  tags?: string[];
}
