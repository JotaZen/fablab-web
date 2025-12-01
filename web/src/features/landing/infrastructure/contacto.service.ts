/**
 * Servicio para obtener datos de la página de contacto desde Strapi
 */

import {
  ContactInfo,
  RedSocial,
  MotivoContacto,
  FAQ,
  ContactFormData,
  ContactoPageData,
  StrapiSingleResponse,
  StrapiCollectionResponse,
  PaginaContactoStrapi,
  FAQStrapi,
} from "../types/contacto.types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Headers comunes para las peticiones a Strapi
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }
  
  return headers;
};

/**
 * Transforma la respuesta de Strapi a nuestros tipos del frontend
 */
const transformContactInfo = (strapi: PaginaContactoStrapi): ContactInfo => ({
  id: "1",
  direccion: strapi.informacionContacto.direccion,
  ciudad: strapi.informacionContacto.ciudad,
  region: strapi.informacionContacto.region,
  codigoPostal: strapi.informacionContacto.codigoPostal,
  telefono: strapi.informacionContacto.telefono,
  telefonoSecundario: strapi.informacionContacto.telefonoSecundario,
  email: strapi.informacionContacto.email,
  emailSoporte: strapi.informacionContacto.emailSoporte,
  horarioSemana: strapi.informacionContacto.horarioSemana,
  horarioFinSemana: strapi.informacionContacto.horarioFinSemana,
  googleMapsUrl: strapi.informacionContacto.googleMapsUrl,
  googleMapsEmbed: strapi.informacionContacto.googleMapsEmbed,
});

const transformRedesSociales = (strapi: PaginaContactoStrapi): RedSocial[] =>
  strapi.redesSociales?.map((red) => ({
    id: String(red.id),
    nombre: red.nombre,
    url: red.url,
    icono: red.icono,
    activo: red.activo,
  })) || [];

const transformMotivosContacto = (strapi: PaginaContactoStrapi): MotivoContacto[] =>
  strapi.motivosContacto?.map((motivo) => ({
    id: String(motivo.id),
    titulo: motivo.titulo,
    descripcion: motivo.descripcion,
    icono: motivo.icono,
    email: motivo.email,
  })) || [];

const transformFAQs = (
  data: StrapiCollectionResponse<FAQStrapi>["data"]
): FAQ[] =>
  data.map((item) => ({
    id: String(item.id),
    pregunta: item.attributes.pregunta,
    respuesta: item.attributes.respuesta,
    categoria: item.attributes.categoria,
    orden: item.attributes.orden,
  }));

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Obtiene los datos de la página de contacto desde Strapi
 */
export async function getContactoPageData(): Promise<ContactoPageData | null> {
  try {
    // Obtener página de contacto (Single Type)
    const pageResponse = await fetch(
      `${STRAPI_URL}/api/pagina-contacto?populate=*`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }, // ISR: revalidar cada 60 segundos
      }
    );

    if (!pageResponse.ok) {
      console.error("Error fetching pagina-contacto:", pageResponse.status);
      return null;
    }

    const pageData: StrapiSingleResponse<PaginaContactoStrapi> = await pageResponse.json();

    // Obtener FAQs (Collection Type)
    const faqsResponse = await fetch(
      `${STRAPI_URL}/api/faqs?sort=orden:asc&pagination[pageSize]=100`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 },
      }
    );

    let faqs: FAQ[] = [];
    if (faqsResponse.ok) {
      const faqsData: StrapiCollectionResponse<FAQStrapi> = await faqsResponse.json();
      faqs = transformFAQs(faqsData.data);
    }

    return {
      contactInfo: transformContactInfo(pageData.data.attributes),
      redesSociales: transformRedesSociales(pageData.data.attributes),
      motivosContacto: transformMotivosContacto(pageData.data.attributes),
      faqs,
    };
  } catch (error) {
    console.error("Error in getContactoPageData:", error);
    return null;
  }
}

/**
 * Obtiene solo las FAQs desde Strapi
 */
export async function getFAQs(categoria?: string): Promise<FAQ[]> {
  try {
    let url = `${STRAPI_URL}/api/faqs?sort=orden:asc&pagination[pageSize]=100`;
    
    if (categoria) {
      url += `&filters[categoria][$eq]=${encodeURIComponent(categoria)}`;
    }

    const response = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("Error fetching FAQs:", response.status);
      return [];
    }

    const data: StrapiCollectionResponse<FAQStrapi> = await response.json();
    return transformFAQs(data.data);
  } catch (error) {
    console.error("Error in getFAQs:", error);
    return [];
  }
}

/**
 * Envía un mensaje de contacto a Strapi
 */
export async function sendContactMessage(
  formData: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/contact-messages`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        data: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono || null,
          motivo: formData.motivo,
          asunto: formData.asunto,
          mensaje: formData.mensaje,
          leido: false,
          respondido: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending contact message:", errorData);
      return {
        success: false,
        error: errorData.error?.message || "Error al enviar el mensaje",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in sendContactMessage:", error);
    return {
      success: false,
      error: "Error de conexión. Por favor intenta nuevamente.",
    };
  }
}

/**
 * Server Action para enviar mensaje de contacto
 * Usar en componentes de servidor o con 'use server'
 */
export async function submitContactForm(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const data: ContactFormData = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    motivo: formData.get("motivo") as string,
    asunto: formData.get("asunto") as string,
    mensaje: formData.get("mensaje") as string,
  };

  // Validación básica
  if (!data.nombre || !data.email || !data.motivo || !data.asunto || !data.mensaje) {
    return {
      success: false,
      error: "Por favor completa todos los campos requeridos",
    };
  }

  return sendContactMessage(data);
}
