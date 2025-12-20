/**
 * Landing Infrastructure
 * 
 * Repositorios para acceso a datos desde Payload CMS.
 */

// Team
export {
    teamRepository,
    getEquipoPageConfig,
    type TeamMember
} from './team.repository';

// Legacy (Strapi) - deprecated, usar teamRepository
export { fetchTeamMembers } from './team.service';
