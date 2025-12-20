/**
 * Tipos para la integración con Strapi de la página de contacto
 * Estos tipos representan la estructura de datos que viene desde el CMS
 */

// ============================================================================
// STRAPI API RESPONSE TYPES
// ============================================================================

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

export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
}

export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ============================================================================
// CONTACT PAGE TYPES
// ============================================================================

/**
 * Información de contacto del FabLab
 * Strapi Component: contacto.informacion-contacto
 */
export interface ContactInfoStrapi {
  direccion: string;
  ciudad: string;
  region: string;
  codigoPostal?: string;
  telefono: string;
  telefonoSecundario?: string;
  email: string;
  emailSoporte?: string;
  horarioSemana: string;
  horarioFinSemana?: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
}

/**
 * Red social
 * Strapi Component: contacto.red-social
 */
export interface RedSocialStrapi {
  id: number;
  nombre: string;
  url: string;
  icono: "facebook" | "instagram" | "linkedin" | "youtube" | "twitter";
  activo: boolean;
}

/**
 * Motivo de contacto
 * Strapi Component: contacto.motivo-contacto
 */
export interface MotivoContactoStrapi {
  id: number;
  titulo: string;
  descripcion: string;
  icono: "message" | "users" | "wrench" | "graduation" | "building";
  email?: string;
}

/**
 * Página de contacto completa
 * Strapi Single Type: api::pagina-contacto.pagina-contacto
 */
export interface PaginaContactoStrapi {
  titulo: string;
  subtitulo?: string;
  informacionContacto: ContactInfoStrapi;
  redesSociales: RedSocialStrapi[];
  motivosContacto: MotivoContactoStrapi[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * FAQ
 * Strapi Collection Type: api::faq.faq
 */
export interface FAQStrapi {
  pregunta: string;
  respuesta: string;
  categoria: "General" | "Membresías" | "Capacitaciones" | "Materiales" | "Reservas" | "Equipos";
  orden: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * Mensaje de contacto
 * Strapi Collection Type: api::contact-message.contact-message
 */
export interface ContactMessageStrapi {
  nombre: string;
  email: string;
  telefono?: string;
  motivo: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FRONTEND TYPES (Transformed from Strapi)
// ============================================================================

export interface ContactInfo {
  id: string;
  direccion: string;
  ciudad: string;
  region: string;
  codigoPostal?: string;
  telefono: string;
  telefonoSecundario?: string;
  email: string;
  emailSoporte?: string;
  horarioSemana: string;
  horarioFinSemana?: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
}

export interface RedSocial {
  id: string;
  nombre: string;
  url: string;
  icono: "facebook" | "instagram" | "linkedin" | "youtube" | "twitter";
  activo: boolean;
}

export interface MotivoContacto {
  id: string;
  titulo: string;
  descripcion: string;
  icono: "message" | "users" | "wrench" | "graduation" | "building";
  email?: string;
}

export interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
  orden: number;
}

export interface ContactFormData {
  nombre: string;
  email: string;
  telefono: string;
  motivo: string;
  asunto: string;
  mensaje: string;
}

export interface ContactoPageData {
  contactInfo: ContactInfo;
  redesSociales: RedSocial[];
  motivosContacto: MotivoContacto[];
  faqs: FAQ[];
}
