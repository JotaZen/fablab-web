// Tipos para Testimonials - basados en schema de Payload

export interface TestimonialData {
    id: string;
    author: string;
    role?: string;
    content: string;
    rating: number;
    featured: boolean;
    published: boolean;
    order: number;
}
