"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import type { ServiceData } from "./data";


export async function getServices(): Promise<ServiceData[]> {
    try {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'services',
            limit: 100,
            sort: 'order',
        });

        return result.docs.map((doc: any) => ({
            id: doc.id,
            name: doc.name || '',
            slug: doc.slug || '',
            category: doc.category || '3d-printing',
            description: doc.description || '',
            icon: doc.icon,
            featuredImage: typeof doc.featuredImage === 'object' ? doc.featuredImage?.url : undefined,
            featured: doc.featured || false,
            status: doc.status || 'draft',
            order: doc.order || 0,
            pricing: doc.pricing || [],
            features: doc.features || [],
        }));
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export async function createService(data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.create({
            collection: 'services',
            data: {
                name: data.get('name') as string,
                slug: (data.get('name') as string).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                category: data.get('category') as string || '3d-printing',
                description: data.get('description') as string,
                icon: data.get('icon') as string || undefined,
                status: data.get('status') as 'draft' | 'published' || 'draft',
                featured: data.get('featured') === 'true',
                order: parseInt(data.get('order') as string) || 0,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating service:', error);
        return { success: false, error: 'Error al crear el servicio' };
    }
}

export async function updateService(id: string, data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.update({
            collection: 'services',
            id,
            data: {
                name: data.get('name') as string,
                category: data.get('category') as string || '3d-printing',
                description: data.get('description') as string,
                icon: data.get('icon') as string || undefined,
                status: data.get('status') as 'draft' | 'published',
                featured: data.get('featured') === 'true',
                order: parseInt(data.get('order') as string) || 0,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating service:', error);
        return { success: false, error: 'Error al actualizar el servicio' };
    }
}

export async function deleteService(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.delete({ collection: 'services', id });
        return { success: true };
    } catch (error) {
        console.error('Error deleting service:', error);
        return { success: false, error: 'Error al eliminar' };
    }
}

export async function toggleServiceFeatured(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        const service = await payload.findByID({ collection: 'services', id });

        await payload.update({
            collection: 'services',
            id,
            data: { featured: !service.featured },
        });

        return { success: true };
    } catch (error) {
        console.error('Error toggling featured:', error);
        return { success: false, error: 'Error al actualizar' };
    }
}

export async function updateServiceStatus(id: string, status: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.update({ collection: 'services', id, data: { status } });
        return { success: true };
    } catch (error) {
        console.error('Error updating status:', error);
        return { success: false, error: 'Error al actualizar' };
    }
}
