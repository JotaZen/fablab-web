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

export interface GalleryImage {
    id: string;
    url: string;
    alt?: string;
}

export interface PracticeHoursSpecialist {
    firstName: string;
    paternalLastName: string;
    maternalLastName?: string;
    rut: string;
}

export interface BidireccionEntry {
    tipoBeneficiario: string;
    rut: string;
    firstName: string;
    paternalLastName: string;
    maternalLastName?: string;
    rol: string;
    horasDocente?: number;
    horasEstudiante?: number;
}

export interface PracticeHoursData {
    beneficiaryType?: string;
    institutionName?: string;
    institutionRut?: string;
    email?: string;
    phone?: string;
    commune?: string;
    referringOrganization?: string;
    specialists?: PracticeHoursSpecialist[];
    bidireccionEntries?: BidireccionEntry[];
}

export interface ProjectData {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    featuredImage: string | null;
    gallery: GalleryImage[];
    technologies: string[];
    creators: ProjectCreator[];
    links: ProjectLink[];
    year: number;
    featured: boolean;
    status: 'draft' | 'published';
    practiceHoursEnabled: boolean;
    practiceHours?: PracticeHoursData;
}
