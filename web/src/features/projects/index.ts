/**
 * Feature: Projects
 * 
 * Proyectos realizados en el FabLab.
 * 
 * @example
 * ```typescript
 * // Server-side
 * import { projectsRepository } from '@/features/projects';
 * const projects = await projectsRepository.getAll();
 * 
 * // Types
 * import type { Project, ProjectCreator } from '@/features/projects';
 * ```
 */

// Infrastructure (carga de datos)
export {
    projectsRepository,
    type Project,
    type ProjectCreator,
    type ProjectLink
} from './infrastructure';

// Presentation (componentes UI)
export * from './presentation/pages/proyectos';
