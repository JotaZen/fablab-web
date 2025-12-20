/**
 * Feature: Landing
 * 
 * Páginas públicas y componentes de la landing page.
 * 
 * @example
 * ```typescript
 * // Cargar datos
 * import { teamRepository, getEquipoPageConfig } from '@/features/landing';
 * const members = await teamRepository.getAll();
 * 
 * // Componentes
 * import { Hero3DSection, TeamSection } from '@/features/landing';
 * ```
 */

// Infrastructure (carga de datos)
export { teamRepository, getEquipoPageConfig, type TeamMember } from './infrastructure';

// Layout Components
export { Navbar } from "../../shared/layout/web/navbar";
export { Footer } from "../../shared/layout/web/footer";

// Common Components
export { SectionTitle, HeroTitle, Subtitle } from "../../shared/ui/texts/titles";
export {
  BodyText,
  LeadText,
  HighlightText,
  CodeText,
} from "../../shared/ui/texts/text";
export {
  ResponsiveImage,
  PlaceholderImage,
  ImageContainer,
} from "../../shared/ui/media/images";

// Section Components
export { Hero3DSection } from "./presentation/sections/hero-3d-section";
export { TechnologiesSection } from "./presentation/sections/technologies-section";
export { ProjectsSection } from "./presentation/sections/projects-section";
export { FeaturedProjectsSection } from "./presentation/sections/featured-projects-section";
export { AboutUsSection } from "./presentation/sections/about-us-section";
export { TechCategoriesSection } from "./presentation/sections/tech-categories-section";
export { TeamSection } from "./presentation/sections/team-section";
export { TecnologiasPage } from "./presentation/sections/tecnologias-page";
export { EquipoPage } from "./presentation/sections/equipo-page";
export { ContactoPage } from "./presentation/sections/contacto-page";
export { PrivacidadPage } from "./presentation/sections/privacidad-page";
export { TerminosPage } from "./presentation/sections/terminos-page";
export { BlogPage } from "./presentation/sections/blog-page";
export { CookiesPage } from "./presentation/sections/cookies-page";

// Graphics Components

// App Components (Business Logic) - IoT
export { TuyaApiConfig, BreakerControlPanel } from "../iot";

