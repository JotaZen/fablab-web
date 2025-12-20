/**
 * Team Repository - Carga de datos desde CMS
 * 
 * Acceso a miembros del equipo desde Payload CMS.
 * La colección está definida en @/features/cms
 * 
 * @example
 * ```typescript
 * import { teamRepository } from '@/features/landing';
 * 
 * const members = await teamRepository.getAll();
 * const leadership = await teamRepository.getByCategory('leadership');
 * ```
 */

import { getPayload } from 'payload';
import config from '@payload-config';

// Tipos
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    category: 'leadership' | 'specialist' | 'collaborator';
    specialty?: string;
    image?: string;
    bio?: string;
    experience?: string;
    achievements: string[];
    social: {
        email?: string;
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    order: number;
    active: boolean;
}

/**
 * Transforma datos de Payload a tipo TeamMember
 */
function transformMember(doc: any): TeamMember {
    return {
        id: String(doc.id),
        name: doc.name,
        role: doc.role,
        category: doc.category,
        specialty: doc.specialty,
        image: typeof doc.image === 'object' ? doc.image?.url : undefined,
        bio: doc.bio,
        experience: doc.experience,
        achievements: doc.achievements?.map((a: any) => a.achievement) || [],
        social: {
            email: doc.social?.email,
            linkedin: doc.social?.linkedin,
            github: doc.social?.github,
            twitter: doc.social?.twitter,
        },
        order: doc.order || 0,
        active: doc.active ?? true,
    };
}

/**
 * Repository para acceder a miembros del equipo
 */
export const teamRepository = {
    /**
     * Obtener todos los miembros activos
     */
    async getAll(): Promise<TeamMember[]> {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'team-members',
            where: { active: { equals: true } },
            sort: 'order',
            limit: 50,
            depth: 1,
        });
        return result.docs.map(transformMember);
    },

    /**
     * Obtener miembros por categoría
     */
    async getByCategory(category: 'leadership' | 'specialist' | 'collaborator'): Promise<TeamMember[]> {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'team-members',
            where: {
                active: { equals: true },
                category: { equals: category },
            },
            sort: 'order',
            limit: 50,
            depth: 1,
        });
        return result.docs.map(transformMember);
    },

    /**
     * Obtener miembro por ID
     */
    async getById(id: string): Promise<TeamMember | null> {
        try {
            const payload = await getPayload({ config });
            const doc = await payload.findByID({
                collection: 'team-members',
                id,
                depth: 1,
            });
            return doc ? transformMember(doc) : null;
        } catch {
            return null;
        }
    },

    /**
     * Obtener estadísticas
     */
    async getStats(): Promise<{ total: number; byCategory: Record<string, number> }> {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'team-members',
            where: { active: { equals: true } },
            limit: 0,
        });

        const byCategory: Record<string, number> = {};
        result.docs.forEach((doc: any) => {
            byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
        });

        return { total: result.totalDocs, byCategory };
    },
};

/**
 * Obtener configuración de la página de equipo
 */
export async function getEquipoPageConfig() {
    const payload = await getPayload({ config });
    const data = await payload.findGlobal({ slug: 'equipo-page' });
    return {
        heroTitle: data.heroTitle || 'Las personas detrás de FabLab',
        heroDescription: data.heroDescription || '',
        heroStats: data.heroStats?.map((s: any) => ({
            text: s.text,
            icon: s.icon,
        })) || [],
    };
}
