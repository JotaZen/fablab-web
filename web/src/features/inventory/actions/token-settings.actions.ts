'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_USER_ID = 'SYSTEM_CONFIG';
const TOKEN_TYPE = 'VESSEL_API_TOKEN';

/**
 * Guarda el token de Vessel en la base de datos.
 * Si ya existe uno, lo actualiza.
 */
export async function saveVesselToken(token: string) {
    if (!token) throw new Error("El token no puede estar vacío");

    try {
        // Buscar si ya existe un token configurado
        const existing = await prisma.userToken.findFirst({
            where: {
                userId: SYSTEM_USER_ID,
                type: TOKEN_TYPE,
            },
        });

        if (existing) {
            // Actualizar
            await prisma.userToken.update({
                where: { id: existing.id },
                data: { token },
            });
        } else {
            // Crear nuevo
            await prisma.userToken.create({
                data: {
                    userId: SYSTEM_USER_ID,
                    type: TOKEN_TYPE,
                    token: token,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error guardando token:", error);
        return { success: false, error: "Error al guardar el token en base de datos" };
    }
}

const URL_TYPE = 'VESSEL_API_URL';

/**
 * Guarda la URL de Vessel en la base de datos.
 */
export async function saveVesselUrl(url: string) {
    if (!url) throw new Error("La URL no puede estar vacía");

    try {
        const existing = await prisma.userToken.findFirst({
            where: {
                userId: SYSTEM_USER_ID,
                type: URL_TYPE,
            },
        });

        if (existing) {
            await prisma.userToken.update({
                where: { id: existing.id },
                data: { token: url }, // Usamos 'token' para guardar la URL
            });
        } else {
            await prisma.userToken.create({
                data: {
                    userId: SYSTEM_USER_ID,
                    type: URL_TYPE,
                    token: url,
                },
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Error guardando URL:", error);
        return { success: false, error: "Error al guardar la URL" };
    }
}

/**
 * Obtiene la URL de Vessel guardada.
 */
export async function getVesselUrl() {
    try {
        const record = await prisma.userToken.findFirst({
            where: {
                userId: SYSTEM_USER_ID,
                type: URL_TYPE,
            },
        });
        return record?.token || null;
    } catch (error) {
        console.error("Error leyendo URL:", error);
        return null;
    }
}

/**
 * Obtiene el token de Vessel guardado.
 */
export async function getVesselToken() {
    try {
        const record = await prisma.userToken.findFirst({
            where: {
                userId: SYSTEM_USER_ID,
                type: TOKEN_TYPE,
            },
        });

        return record?.token || null;
    } catch (error) {
        console.error("Error leyendo token:", error);
        return null;
    }
}
