"use server";

import { getPayload } from "payload";
import config from "@/../../payload.config";

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

export async function getTestimonials(): Promise<TestimonialData[]> {
    try {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'testimonials',
            limit: 100,
            sort: 'order',
        });

        return result.docs.map((doc: any) => ({
            id: doc.id,
            author: doc.author || '',
            role: doc.role,
            content: doc.content || '',
            rating: doc.rating || 5,
            featured: doc.featured || false,
            published: doc.published ?? true,
            order: doc.order || 0,
        }));
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

export async function createTestimonial(data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.create({
            collection: 'testimonials',
            data: {
                author: data.get('author') as string,
                role: data.get('role') as string || undefined,
                content: data.get('content') as string,
                rating: parseInt(data.get('rating') as string) || 5,
                featured: data.get('featured') === 'true',
                published: data.get('published') === 'true',
                order: parseInt(data.get('order') as string) || 0,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return { success: false, error: 'Error al crear el testimonio' };
    }
}

export async function updateTestimonial(id: string, data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.update({
            collection: 'testimonials',
            id,
            data: {
                author: data.get('author') as string,
                role: data.get('role') as string || undefined,
                content: data.get('content') as string,
                rating: parseInt(data.get('rating') as string) || 5,
                featured: data.get('featured') === 'true',
                published: data.get('published') === 'true',
                order: parseInt(data.get('order') as string) || 0,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return { success: false, error: 'Error al actualizar el testimonio' };
    }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.delete({ collection: 'testimonials', id });
        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return { success: false, error: 'Error al eliminar' };
    }
}
