/**
 * Tipos de la API de Vessel (snake_case)
 * Estos tipos representan la estructura de datos que viene de la API
 */

/** Vocabulario como viene de la API */
export interface ApiVocabulary {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/** Término como viene de la API */
export interface ApiTerm {
  id: string;
  name: string;
  vocabulary_id: string;
  parent_id?: string | null;
  description?: string;
  level?: number;
  created_at?: string;
  updated_at?: string;
}

/** Árbol de términos de la API */
export interface ApiTermTree extends ApiTerm {
  children: ApiTermTree[];
}

/** Breadcrumb de la API */
export interface ApiBreadcrumb {
  id: string;
  name: string;
}

/** Respuesta de lista de la API */
export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}
