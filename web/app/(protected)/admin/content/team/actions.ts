"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";

/**
 * Obtiene TODOS los usuarios para mostrar en la tabla de admin
 * Incluye usuarios con showInTeam = true y false
 */
export async function getAllTeamUsers() {
    try {
        const payload = await getPayload({ config });
        
        const { docs: members } = await payload.find({
            collection: "users",
            depth: 1,
            limit: 100,
            sort: 'name',
        });

        return members.map((doc: any) => ({
            id: doc.id,
            name: doc.name || 'Sin nombre',
            email: doc.email,
            role: doc.jobTitle || '',
            category: doc.category || 'specialist',
            specialty: doc.jobTitle || '',
            bio: doc.bio || '',
            experience: doc.experience || '',
            educationStatus: doc.educationStatus || 'graduated',
            imagePosition: doc.imagePosition || '50% 50%',
            image: typeof doc.avatar === 'object' ? doc.avatar?.url : null,
            active: doc.showInTeam === true,
            userRole: doc.role || 'viewer',
        }));
    } catch (error) {
        console.error("[TeamActions] Error obteniendo todos los usuarios:", error);
        return [];
    }
}

/**
 * Obtiene solo los miembros visibles en /equipo (showInTeam = true)
 */
export async function getTeamMembers() {
    try {
        const payload = await getPayload({ config });
        
        // Leer de la colección users con showInTeam = true
        const { docs: members } = await payload.find({
            collection: "users",
            depth: 1,
            limit: 100,
            where: {
                showInTeam: {
                    equals: true,
                },
            },
            sort: 'name',
        });

        // Serialize for client
        return members.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            role: doc.jobTitle || '',
            category: doc.category || 'collaborator',
            specialty: doc.jobTitle || '',
            bio: doc.bio,
            experience: doc.experience,
            educationStatus: doc.educationStatus || 'graduated',
            imagePosition: doc.imagePosition || '50% 50%',
            image: typeof doc.avatar === 'object' ? doc.avatar?.url : doc.avatar,
            imageId: typeof doc.avatar === 'object' ? doc.avatar?.id : doc.avatar,
            email: doc.email,
            social: {
                email: doc.email,
                linkedin: doc.linkedin,
                github: doc.github,
            },
            active: doc.showInTeam !== false,
            userRole: doc.role, // rol de sistema (admin, editor, viewer)
        }));
    } catch (error) {
        console.error("[TeamActions] Error obteniendo miembros del equipo:", error);
        return [];
    }
}

export async function createTeamMember(formData: FormData) {
    try {
        const payload = await getPayload({ config });

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        // Verificar si ya existe un usuario con ese email
        const existing = await payload.find({
            collection: 'users',
            where: {
                email: { equals: email },
            },
            limit: 1,
        });

        if (existing.docs.length > 0) {
            return { success: false, error: 'Ya existe un usuario con ese correo electrónico' };
        }

        // Preparar datos del usuario
        const categoryMap: Record<string, string> = {
            'leadership': 'leadership',
            'leader': 'leadership',
            'specialist': 'specialist',
            'collaborator': 'collaborator',
            'intern': 'collaborator',
        };

        // Determinar rol de sistema basado en isAdmin
        const isAdmin = formData.get('isAdmin') === 'true';
        const systemRole = isAdmin ? 'admin' : 'viewer';

        const data: any = {
            name: name,
            email: email,
            password: password || `Fablab${Date.now()}!`, // Contraseña temporal si no se proporciona
            jobTitle: formData.get('role') || formData.get('specialty'),
            bio: formData.get('bio'),
            experience: formData.get('experience'),
            category: categoryMap[formData.get('category') as string] || 'specialist',
            educationStatus: formData.get('educationStatus') || 'graduated',
            imagePosition: formData.get('imagePosition') || '50% 50%',
            showInTeam: true,
            order: 0,
            role: systemRole, // Rol de sistema: admin o viewer
            linkedin: formData.get('linkedin'),
            github: formData.get('github'),
        };

        // Manejar imagen/avatar
        const file = formData.get('image') as File;
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                    alt: name || file.name,
                },
                file: {
                    data: buffer,
                    name: file.name,
                    mimetype: file.type,
                    size: file.size,
                }
            });
            data.avatar = mediaDoc.id;
        }

        await payload.create({
            collection: 'users',
            data,
        });

        revalidatePath('/admin/content/team');
        revalidatePath('/equipo');
        return { success: true };
    } catch (error) {
        console.error("[TeamActions] Error creando miembro del equipo:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function updateTeamMember(id: string, formData: FormData) {
    try {
        const payload = await getPayload({ config });

        const categoryMap: Record<string, string> = {
            'leadership': 'leadership',
            'leader': 'leadership',
            'specialist': 'specialist',
            'collaborator': 'collaborator',
            'intern': 'collaborator',
        };

        // Determinar rol de sistema basado en isAdmin
        const isAdmin = formData.get('isAdmin') === 'true';
        const systemRole = isAdmin ? 'admin' : 'viewer';

        const data: any = {
            name: formData.get('name'),
            jobTitle: formData.get('role') || formData.get('specialty'),
            bio: formData.get('bio'),
            experience: formData.get('experience'),
            category: categoryMap[formData.get('category') as string] || 'specialist',
            educationStatus: formData.get('educationStatus') || 'graduated',
            imagePosition: formData.get('imagePosition') || '50% 50%',
            showInTeam: formData.get('active') !== 'false',
            role: systemRole, // Actualizar rol de sistema
            linkedin: formData.get('linkedin'),
            github: formData.get('github'),
        };

        // Si se proporciona email, actualizarlo
        const email = formData.get('email') as string;
        if (email) {
            data.email = email;
        }

        const file = formData.get('image') as File;
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                    alt: formData.get('name') || file.name,
                },
                file: {
                    data: buffer,
                    name: file.name,
                    mimetype: file.type,
                    size: file.size,
                }
            });
            data.avatar = mediaDoc.id;
        }

        await payload.update({
            collection: 'users',
            id,
            data,
        });

        revalidatePath('/admin/content/team');
        revalidatePath('/equipo');
        return { success: true };
    } catch (error) {
        console.error("[TeamActions] Error actualizando miembro del equipo:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function deleteTeamMember(id: string) {
    try {
        const payload = await getPayload({ config });
        
        // En lugar de eliminar el usuario, solo quitarlo del equipo
        await payload.update({
            collection: 'users',
            id,
            data: {
                showInTeam: false,
            },
        });
        
        revalidatePath('/admin/content/team');
        revalidatePath('/equipo');
        return { success: true };
    } catch (error) {
        console.error("[TeamActions] Error eliminando miembro del equipo:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function toggleTeamMemberStatus(id: string, active: boolean) {
    try {
        const payload = await getPayload({ config });

        await payload.update({
            collection: 'users',
            id,
            data: {
                showInTeam: active,
            },
        });

        revalidatePath('/admin/content/team');
        revalidatePath('/equipo');
        return { success: true };
    } catch (error) {
        console.error("[TeamActions] Error cambiando estado del miembro:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}
