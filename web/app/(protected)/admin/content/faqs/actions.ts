"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import type { FAQData } from "./data";


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
            overrideAccess: true, // Server actions no tienen contexto de usuario de Payload
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
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error creating FAQ:', errorMessage, error);
        return { success: false, error: `Error al crear la FAQ: ${errorMessage}` };
    }
}

export async function updateFAQ(id: string, data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.update({
            collection: 'faqs',
            id,
            overrideAccess: true,
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
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error updating FAQ:', errorMessage, error);
        return { success: false, error: `Error al actualizar: ${errorMessage}` };
    }
}

export async function deleteFAQ(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.delete({ collection: 'faqs', id, overrideAccess: true });
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error deleting FAQ:', errorMessage, error);
        return { success: false, error: `Error al eliminar: ${errorMessage}` };
    }
}
