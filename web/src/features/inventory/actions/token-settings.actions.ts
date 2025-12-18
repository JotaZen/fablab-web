'use server';

/**
 * Token Settings Actions - Version Payload CMS
 * 
 * En lugar de Prisma, usamos variables de entorno.
 * En el futuro, estos valores podrían guardarse en Payload CMS.
 */

/**
 * Obtiene la URL de Vessel desde variables de entorno.
 */
export async function getVesselUrl() {
    return process.env.NEXT_PUBLIC_VESSEL_API_URL || process.env.VESSEL_API_URL || null;
}

/**
 * Obtiene el token de Vessel desde variables de entorno.
 */
export async function getVesselToken() {
    return process.env.VESSEL_API_TOKEN || null;
}

/**
 * Placeholder para guardar token (no implementado sin Prisma).
 * En producción, esto debería guardarse en Payload CMS.
 */
export async function saveVesselToken(_token: string) {
    console.warn("saveVesselToken: Esta función requiere configurar el token en .env");
    return {
        success: false,
        error: "Configure VESSEL_API_TOKEN en las variables de entorno"
    };
}

/**
 * Placeholder para guardar URL (no implementado sin Prisma).
 * En producción, esto debería guardarse en Payload CMS.
 */
export async function saveVesselUrl(_url: string) {
    console.warn("saveVesselUrl: Esta función requiere configurar la URL en .env");
    return {
        success: false,
        error: "Configure NEXT_PUBLIC_VESSEL_API_URL en las variables de entorno"
    };
}
