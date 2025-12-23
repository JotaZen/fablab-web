"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import type { ProjectData } from "./data";


export async function getProjects(): Promise<ProjectData[]> {
    try {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'projects',
            sort: '-featured,order',
            limit: 100,
            depth: 2,
            overrideAccess: true,
        });

        return result.docs.map((doc: any) => ({
            id: String(doc.id),
            title: doc.title,
            slug: doc.slug,
            category: doc.category,
            description: doc.description,
            featuredImage: typeof doc.featuredImage === 'object' ? doc.featuredImage?.url : null,
            technologies: doc.technologies?.map((t: any) => t.name) || [],
            creators: doc.creators?.map((c: any) => ({
                teamMemberId: c.teamMember?.id ? String(c.teamMember.id) : undefined,
                teamMemberName: c.teamMember?.name,
                externalName: c.externalName,
                role: c.role,
            })) || [],
            links: doc.links?.map((l: any) => ({ label: l.label, url: l.url })) || [],
            year: doc.year || new Date().getFullYear(),
            featured: doc.featured || false,
            status: doc.status || 'draft',
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export async function getTeamMembersForSelect(): Promise<Array<{ id: string; name: string }>> {
    try {
        const payload = await getPayload({ config });
        const result = await payload.find({
            collection: 'team-members',
            where: { active: { equals: true } },
            sort: 'name',
            limit: 100,
            overrideAccess: true,
        });
        return result.docs.map((doc: any) => ({ id: String(doc.id), name: doc.name }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function createProject(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        const technologies = (formData.get('technologies') as string || '')
            .split(',').map(t => ({ name: t.trim() })).filter(t => t.name);

        let creators: any[] = [];
        let links: any[] = [];
        try { creators = JSON.parse(formData.get('creators') as string || '[]'); } catch { }
        try { links = JSON.parse(formData.get('links') as string || '[]'); } catch { }

        const imageFile = formData.get('image') as File;
        let featuredImageId: string | undefined;
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const uploadResult = await payload.create({
                collection: 'media',
                overrideAccess: true,
                data: { alt: formData.get('title') as string },
                file: { data: buffer, mimetype: imageFile.type, name: imageFile.name, size: imageFile.size },
            });
            featuredImageId = String(uploadResult.id);
        }

        const title = formData.get('title') as string;
        const slug = (formData.get('slug') as string) || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        await payload.create({
            collection: 'projects',
            overrideAccess: true,
            data: {
                title, slug,
                category: formData.get('category') as string || 'Hardware',
                description: formData.get('description') as string,
                year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
                featured: formData.get('featured') === 'true',
                status: formData.get('status') as string || 'draft',
                technologies, creators, links,
                ...(featuredImageId && { featuredImage: featuredImageId }),
            },
        });

        revalidatePath('/admin/content/projects');
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error: any) {
        console.error('Error:', error);
        return { success: false, error: error.message };
    }
}

export async function updateProject(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });

        const technologies = (formData.get('technologies') as string || '')
            .split(',').map(t => ({ name: t.trim() })).filter(t => t.name);

        let creators: any[] = [];
        let links: any[] = [];
        try { creators = JSON.parse(formData.get('creators') as string || '[]'); } catch { }
        try { links = JSON.parse(formData.get('links') as string || '[]'); } catch { }

        let updateData: any = {
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
            featured: formData.get('featured') === 'true',
            status: formData.get('status') as string || 'draft',
            technologies, creators, links,
        };

        const slug = formData.get('slug') as string;
        if (slug) updateData.slug = slug;

        const imageFile = formData.get('image') as File;
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const uploadResult = await payload.create({
                collection: 'media',
                overrideAccess: true,
                data: { alt: formData.get('title') as string },
                file: { data: buffer, mimetype: imageFile.type, name: imageFile.name, size: imageFile.size },
            });
            updateData.featuredImage = String(uploadResult.id);
        }

        await payload.update({ collection: 'projects', id, data: updateData, overrideAccess: true });
        revalidatePath('/admin/content/projects');
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error: any) {
        console.error('Error:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.delete({ collection: 'projects', id, overrideAccess: true });
        revalidatePath('/admin/content/projects');
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleProjectFeatured(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        const project = await payload.findByID({ collection: 'projects', id, overrideAccess: true });
        await payload.update({ collection: 'projects', id, data: { featured: !project.featured }, overrideAccess: true });
        revalidatePath('/admin/content/projects');
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProjectStatus(id: string, status: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config });
        await payload.update({ collection: 'projects', id, data: { status }, overrideAccess: true });
        revalidatePath('/admin/content/projects');
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
