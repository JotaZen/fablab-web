/**
 * Tipos para la respuesta de Strapi - Proyectos
 */

// Respuesta genérica de Strapi
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Componente base de Strapi (dynamic zone)
export interface StrapiComponent {
  id: number;
  __component: string;
}

// Componente: Secciones del Proyecto
export interface StrapiSeccionesDelProyecto extends StrapiComponent {
  __component: "proyecto.secciones-del-proyecto";
  titulo?: string;
  descripcion?: string;
  objetivos?: string;
  resultados?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: "en-progreso" | "completado" | "pausado";
}

// Componente: Tecnologías
export interface StrapiTecnologia {
  id: number;
  nombre: string;
  icono?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  categoria?: string;
  descripcion?: string;
}

export interface StrapiTecnologias extends StrapiComponent {
  __component: "proyecto.tecnologias";
  titulo?: string;
  tecnologias?: StrapiTecnologia[];
}

// Componente: Equipo
export interface StrapiMiembro {
  id: number;
  nombre: string;
  rol?: string;
  avatar?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  linkedin?: string;
  github?: string;
}

export interface StrapiEquipo extends StrapiComponent {
  __component: "proyecto.equipo";
  titulo?: string;
  miembros?: StrapiMiembro[];
}

// Componente: Imágenes
export interface StrapiImagen {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
}

export interface StrapiImagenes extends StrapiComponent {
  __component: "proyecto.imagenes";
  titulo?: string;
  imagenes?: {
    data?: Array<{
      id: number;
      attributes: StrapiImagen;
    }>;
  };
}

// Componente: Contenido General
export interface StrapiContenidoGeneral extends StrapiComponent {
  __component: "proyecto.contenido-general";
  titulo?: string;
  contenido?: string;
}

// Unión de todos los componentes posibles en secciones
export type StrapiSeccion =
  | StrapiSeccionesDelProyecto
  | StrapiTecnologias
  | StrapiEquipo
  | StrapiImagenes
  | StrapiContenidoGeneral;

// Proyecto de Strapi
export interface StrapiProyecto {
  id: number;
  documentId: string;
  Titulo: string;
  Encabezado: string;
  secciones: StrapiSeccion[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Respuesta del API de Strapi para proyecto (single type)
export type StrapiProyectoResponse = StrapiResponse<StrapiProyecto>;
