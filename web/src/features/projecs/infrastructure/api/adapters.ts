/**
 * Adaptadores para convertir datos de Strapi a dominio
 */

import type {
  Project,
  ProjectSection,
  HeroSection,
  ProjectDetailsSection,
  TechnologiesSection,
  TeamSection,
  GallerySection,
  ContentSection,
  Technology,
  TeamMember,
  ProjectImage,
} from "@/features/projecs/domain";

import type {
  StrapiProyecto,
  StrapiSeccion,
  StrapiSeccionesDelProyecto,
  StrapiTecnologias,
  StrapiEquipo,
  StrapiImagenes,
  StrapiContenidoGeneral,
} from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Construye URL completa para assets de Strapi
 */
function buildAssetUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}

/**
 * Convierte una sección de Strapi al tipo de dominio correspondiente
 */
function convertSection(section: StrapiSeccion, orden: number): ProjectSection {
  switch (section.__component) {
    case "proyecto.secciones-del-proyecto": {
      const s = section as StrapiSeccionesDelProyecto;
      const projectSection: ProjectDetailsSection = {
        id: String(section.id),
        tipo: "proyecto",
        orden,
        titulo: s.titulo,
        descripcion: s.descripcion || "",
        objetivos: s.objetivos ? s.objetivos.split("\n").filter(Boolean) : undefined,
        resultados: s.resultados ? s.resultados.split("\n").filter(Boolean) : undefined,
        fechaInicio: s.fechaInicio,
        fechaFin: s.fechaFin,
        estado: s.estado || "en-progreso",
      };
      return projectSection;
    }

    case "proyecto.tecnologias": {
      const s = section as StrapiTecnologias;
      const technologies: Technology[] = (s.tecnologias || []).map((t) => ({
        id: String(t.id),
        nombre: t.nombre,
        icono: buildAssetUrl(t.icono?.data?.attributes?.url),
        categoria: (t.categoria as Technology["categoria"]) || "other",
        descripcion: t.descripcion,
      }));
      
      const techSection: TechnologiesSection = {
        id: String(section.id),
        tipo: "tecnologias",
        orden,
        titulo: s.titulo || "Tecnologías",
        tecnologias: technologies,
      };
      return techSection;
    }

    case "proyecto.equipo": {
      const s = section as StrapiEquipo;
      const members: TeamMember[] = (s.miembros || []).map((m) => ({
        id: String(m.id),
        nombre: m.nombre,
        rol: m.rol || "",
        avatar: buildAssetUrl(m.avatar?.data?.attributes?.url),
        linkedin: m.linkedin,
        github: m.github,
      }));
      
      const teamSection: TeamSection = {
        id: String(section.id),
        tipo: "equipo",
        orden,
        titulo: s.titulo || "Equipo",
        miembros: members,
      };
      return teamSection;
    }

    case "proyecto.imagenes": {
      const s = section as StrapiImagenes;
      const images: ProjectImage[] = (s.imagenes?.data || []).map((img) => ({
        id: String(img.id),
        url: buildAssetUrl(img.attributes.url) || "",
        alt: img.attributes.alternativeText || "",
        caption: img.attributes.caption,
      }));
      
      const gallerySection: GallerySection = {
        id: String(section.id),
        tipo: "galeria",
        orden,
        titulo: s.titulo,
        imagenes: images,
      };
      return gallerySection;
    }

    case "proyecto.contenido-general": {
      const s = section as StrapiContenidoGeneral;
      const contentSection: ContentSection = {
        id: String(section.id),
        tipo: "custom",
        orden,
        titulo: s.titulo,
        contenido: s.contenido,
      };
      return contentSection;
    }

    default: {
      // Sección desconocida
      const unknownSection = section as { id: number };
      return {
        id: String(unknownSection.id),
        tipo: "custom" as const,
        orden,
        contenido: "Sección no reconocida",
      };
    }
  }
}

/**
 * Convierte un proyecto de Strapi al tipo de dominio
 */
export function strapiToProject(strapi: StrapiProyecto): Project {
  // Generar sección Hero automáticamente
  const heroSection: HeroSection = {
    id: "hero-auto",
    tipo: "hero",
    orden: 0,
    subtitulo: strapi.Encabezado,
  };

  // Convertir secciones de Strapi
  const sections: ProjectSection[] = [
    heroSection,
    ...strapi.secciones.map((s, index) => convertSection(s, index + 1)),
  ];

  return {
    id: String(strapi.id),
    slug: strapi.documentId || String(strapi.id),
    titulo: strapi.Titulo,
    encabezado: strapi.Encabezado,
    descripcionCorta: strapi.Encabezado,
    secciones: sections,
    fechaPublicacion: strapi.publishedAt,
  };
}
