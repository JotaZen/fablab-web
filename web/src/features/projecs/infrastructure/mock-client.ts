import type { Project } from "@/features/projecs/domain";
import mockData from "./data/mock-projects.json";

/**
 * Cliente mock para obtener datos de proyectos
 * Simula las respuestas del API de Strapi
 */

export function getAllProjects(): Project[] {
  return mockData.proyectos as Project[];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return mockData.proyectos.find((p) => p.slug === slug) as Project | undefined;
}

export function getProjectById(id: string): Project | undefined {
  return mockData.proyectos.find((p) => p.id === id) as Project | undefined;
}

export function getFeaturedProjects(): Project[] {
  return mockData.proyectos.filter((p) => p.destacado) as Project[];
}
