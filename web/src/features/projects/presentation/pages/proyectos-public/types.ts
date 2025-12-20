/**
 * Types - Public Proyectos Page
 */

export interface ProjectPublic {
    id: string;
    title: string;
    slug: string;
    category: 'hardware' | 'software' | 'design' | 'iot';
    description: string;
    featuredImage: string | null;
    technologies: string[];
    creators: Array<{ name: string; role?: string; avatar?: string }>;
    year: number;
    featured: boolean;
    objective?: string;
    problemSolved?: string;
    links?: {
        github?: string;
        video?: string;
        thingiverse?: string;
        documentation?: string;
    };
}

export const CATEGORY_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
    hardware: { label: 'Hardware', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    software: { label: 'Software', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    design: { label: 'Diseño', color: 'text-pink-700', bgColor: 'bg-pink-100' },
    iot: { label: 'IoT', color: 'text-green-700', bgColor: 'bg-green-100' },
};
