// Tipos para Projects - basados en schema de Payload

export interface ProjectLink {
    label: string;
    url: string;
}

export interface ProjectCreator {
    teamMemberId?: string;
    teamMemberName?: string;
    externalName?: string;
    role?: string;
}

export interface ProjectData {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    featuredImage: string | null;
    technologies: string[];
    creators: ProjectCreator[];
    links: ProjectLink[];
    year: number;
    featured: boolean;
    status: 'draft' | 'published';
}
