// Tipos compartidos para Services - basados en el schema de Payload CMS

export interface ServiceData {
    id: string;
    name: string;
    slug: string;
    category?: string;
    description: string;
    icon?: string;
    featuredImage?: string;
    featured: boolean;
    status: 'draft' | 'published';
    order: number;
}
