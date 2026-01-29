"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getCurrentUserProfile() {
    try {
        const payload = await getPayload({ config });
        const cookieStore = await cookies();
        const token = cookieStore.get('payload-token')?.value;
        
        if (!token) {
            return { success: false, error: 'No autenticado' };
        }

        // Verificar el token y obtener el usuario
        const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) });
        
        if (!user) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        // Obtener datos completos del usuario
        const fullUser = await payload.findByID({
            collection: 'users',
            id: user.id,
            depth: 1,
        });

        return {
            success: true,
            user: {
                id: fullUser.id,
                name: fullUser.name || '',
                email: fullUser.email,
                jobTitle: fullUser.jobTitle || '',
                bio: fullUser.bio || '',
                category: fullUser.category || 'specialist',
                showInTeam: fullUser.showInTeam || false,
                linkedin: fullUser.linkedin || '',
                github: fullUser.github || '',
                experience: fullUser.experience || '',
                avatar: typeof fullUser.avatar === 'object' ? fullUser.avatar?.url : null,
                avatarId: typeof fullUser.avatar === 'object' ? fullUser.avatar?.id : fullUser.avatar,
                role: fullUser.role,
            }
        };
    } catch (error) {
        console.error("[ProfileActions] Error obteniendo perfil:", error);
        return { success: false, error: 'Error al obtener perfil' };
    }
}

export async function updateUserProfile(formData: FormData) {
    try {
        const payload = await getPayload({ config });
        const cookieStore = await cookies();
        const token = cookieStore.get('payload-token')?.value;
        
        if (!token) {
            return { success: false, error: 'No autenticado' };
        }

        const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) });
        
        if (!user) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        const data: Record<string, any> = {
            name: formData.get('name'),
            jobTitle: formData.get('jobTitle'),
            bio: formData.get('bio'),
            category: formData.get('category'),
            showInTeam: formData.get('showInTeam') === 'true',
            linkedin: formData.get('linkedin'),
            github: formData.get('github'),
            experience: formData.get('experience'),
        };

        // Manejar cambio de email
        const newEmail = formData.get('email') as string;
        if (newEmail && newEmail !== user.email) {
            // Verificar que el email no esté en uso
            const existing = await payload.find({
                collection: 'users',
                where: {
                    email: { equals: newEmail },
                    id: { not_equals: user.id },
                },
                limit: 1,
            });

            if (existing.docs.length > 0) {
                return { success: false, error: 'El correo electrónico ya está en uso' };
            }
            data.email = newEmail;
        }

        // Manejar cambio de contraseña
        const newPassword = formData.get('password') as string;
        if (newPassword && newPassword.length >= 8) {
            data.password = newPassword;
        }

        // Manejar imagen/avatar
        const file = formData.get('avatar') as File;
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
            id: user.id,
            data,
        });

        revalidatePath('/admin/profile');
        revalidatePath('/equipo');
        return { success: true };
    } catch (error) {
        console.error("[ProfileActions] Error actualizando perfil:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Error al actualizar perfil' };
    }
}
