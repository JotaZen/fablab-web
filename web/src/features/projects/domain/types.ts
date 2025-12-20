/**
 * Tipos de dominio para el módulo de Proyectos
 */

// Miembro del equipo
export interface TeamMember {
  id: string;
  nombre: string;
  rol: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
}

// Tecnología utilizada en el proyecto
export interface Technology {
  id: string;
  nombre: string;
  icono?: string;
  categoria: "frontend" | "backend" | "database" | "devops" | "design" | "hardware" | "other";
  descripcion?: string;
}

// Imagen del proyecto
export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

// Sección genérica de contenido
export interface ContentSection {
  id: string;
  tipo: "hero" | "proyecto" | "tecnologias" | "equipo" | "galeria" | "custom";
  titulo?: string;
  contenido?: string;
  orden: number;
}

// Sección Hero específica
export interface HeroSection extends ContentSection {
  tipo: "hero";
  subtitulo?: string;
  imagenFondo?: string;
  ctaTexto?: string;
  ctaUrl?: string;
}

// Sección de detalles del proyecto
export interface ProjectDetailsSection extends ContentSection {
  tipo: "proyecto";
  descripcion: string;
  objetivos?: string[];
  resultados?: string[];
  fechaInicio?: string;
  fechaFin?: string;
  estado: "en-progreso" | "completado" | "pausado";
}

// Sección de tecnologías
export interface TechnologiesSection extends ContentSection {
  tipo: "tecnologias";
  tecnologias: Technology[];
}

// Sección de equipo
export interface TeamSection extends ContentSection {
  tipo: "equipo";
  miembros: TeamMember[];
}

// Sección de galería
export interface GallerySection extends ContentSection {
  tipo: "galeria";
  imagenes: ProjectImage[];
}

// Unión de todas las secciones posibles
export type ProjectSection = 
  | HeroSection 
  | ProjectDetailsSection 
  | TechnologiesSection 
  | TeamSection 
  | GallerySection
  | ContentSection;

// Proyecto completo
export interface Project {
  id: string;
  slug: string;
  titulo: string;
  encabezado: string;
  descripcionCorta: string;
  imagenPortada?: string;
  secciones: ProjectSection[];
  tags?: string[];
  fechaPublicacion?: string;
  destacado?: boolean;
}

// Props para el componente PlantillaPaginaProyecto
export interface PlantillaPaginaProyectoProps {
  titulo: string;
  encabezado: string;
  secciones: ProjectSection[];
  imagenPortada?: string;
}
