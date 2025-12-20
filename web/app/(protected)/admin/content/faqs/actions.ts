"use server";

import { getPayload } from "payload";
import config from "@/../../payload.config";

export interface FAQData {
    id: string;
    question: string;
    category: string;
    order: number;
    published: boolean;
}

export const FAQ_CATEGORIES = {
    general: 'General',
    membership: 'Membresías',
    services: 'Servicios',
    equipment: 'Equipamiento',
    events: 'Eventos',
    schedule: 'Horarios',
    payments: 'Pagos',
};

export async function getFAQs(): Promise<FAQData[]> {
    try {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'faqs',
            limit: 100,
            sort: 'order',
        });

        return result.docs.map((doc: any) => ({
            id: doc.id,
            question: doc.question || '',
            category: doc.category || 'general',
            order: doc.order || 0,
            published: doc.published ?? true,
        }));
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
}

export async function createFAQ(data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.create({
            collection: 'faqs',
            data: {
                question: data.get('question') as string,
                answer: [{ children: [{ text: data.get('answer') as string }] }],
                category: data.get('category') as string,
                order: parseInt(data.get('order') as string) || 0,
                published: data.get('published') === 'true',
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating FAQ:', error);
        return { success: false, error: 'Error al crear la FAQ' };
    }
}

export async function updateFAQ(id: string, data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.update({
            collection: 'faqs',
            id,
            data: {
                question: data.get('question') as string,
                answer: [{ children: [{ text: data.get('answer') as string }] }],
                category: data.get('category') as string,
                order: parseInt(data.get('order') as string) || 0,
                published: data.get('published') === 'true',
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating FAQ:', error);
        return { success: false, error: 'Error al actualizar la FAQ' };
    }
}

export async function deleteFAQ(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.delete({ collection: 'faqs', id });
        return { success: true };
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return { success: false, error: 'Error al eliminar' };
    }
}
