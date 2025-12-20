"use server";

import { getPayload } from "payload";
import config from "@/../../payload.config";

export interface EventData {
    id: string;
    title: string;
    slug: string;
    type: 'workshop' | 'course' | 'talk' | 'hackathon' | 'open-day' | 'meetup';
    description: string;
    startDate: string;
    endDate?: string;
    location?: string;
    isOnline: boolean;
    capacity?: number;
    featured: boolean;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
}

export const EVENT_TYPES = {
    workshop: 'Taller',
    course: 'Curso',
    talk: 'Charla',
    hackathon: 'Hackathon',
    'open-day': 'Open Day',
    meetup: 'Meetup',
};

export async function getEvents(): Promise<EventData[]> {
    try {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'events',
            limit: 100,
            sort: '-startDate',
        });

        return result.docs.map((doc: any) => ({
            id: doc.id,
            title: doc.title || '',
            slug: doc.slug || '',
            type: doc.type || 'workshop',
            description: doc.description || '',
            startDate: doc.startDate,
            endDate: doc.endDate,
            location: doc.location,
            isOnline: doc.isOnline || false,
            capacity: doc.capacity,
            featured: doc.featured || false,
            status: doc.status || 'draft',
        }));
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function createEvent(data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.create({
            collection: 'events',
            data: {
                title: data.get('title') as string,
                type: data.get('type') as string,
                description: data.get('description') as string,
                startDate: data.get('startDate') as string,
                endDate: data.get('endDate') as string || undefined,
                location: data.get('location') as string || undefined,
                isOnline: data.get('isOnline') === 'true',
                capacity: parseInt(data.get('capacity') as string) || undefined,
                status: data.get('status') as string || 'draft',
                featured: data.get('featured') === 'true',
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating event:', error);
        return { success: false, error: 'Error al crear el evento' };
    }
}

export async function updateEvent(id: string, data: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        await payload.update({
            collection: 'events',
            id,
            data: {
                title: data.get('title') as string,
                type: data.get('type') as string,
                description: data.get('description') as string,
                startDate: data.get('startDate') as string,
                endDate: data.get('endDate') as string || undefined,
                location: data.get('location') as string || undefined,
                isOnline: data.get('isOnline') === 'true',
                capacity: parseInt(data.get('capacity') as string) || undefined,
                status: data.get('status') as string,
                featured: data.get('featured') === 'true',
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating event:', error);
        return { success: false, error: 'Error al actualizar el evento' };
    }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.delete({ collection: 'events', id });
        return { success: true };
    } catch (error) {
        console.error('Error deleting event:', error);
        return { success: false, error: 'Error al eliminar' };
    }
}
