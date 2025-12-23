/**
 * Utilidades de autorización para API routes
 * Usa tipos de permisos existentes para verificación type-safe
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getRole, type RoleCode } from '@/features/auth/domain/entities/role';
import { hasModuleAccess, type FeatureModule, type AccessLevel, type UserModuleAccess } from '@/features/auth/domain/value-objects/permission';

/**
 * Resultado de la verificación de autenticación
 */
export interface AuthResult {
    authenticated: boolean;
    userId?: string;
    email?: string;
    roleCode?: RoleCode;
    moduleAccess?: UserModuleAccess;
    error?: string;
}

/**
 * Verificar autenticación desde el token JWT en cookies
 * Retorna info del usuario si está autenticado
 */
export async function verifyAuth(): Promise<AuthResult> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('fablab_token')?.value;

        if (!token) {
            return { authenticated: false, error: 'No token provided' };
        }

        // Verificar token con Payload
        const payload = await getPayload({ config: configPromise });

        // Decodificar y verificar el JWT
        // Payload almacena el user ID en el token
        const decoded = payload.jwt.decode(token);

        if (!decoded || typeof decoded === 'string') {
            return { authenticated: false, error: 'Invalid token' };
        }

        const userId = decoded.id as string;
        if (!userId) {
            return { authenticated: false, error: 'No user ID in token' };
        }

        // Obtener usuario de la DB
        const user = await payload.findByID({
            collection: 'users',
            id: userId,
        });

        if (!user) {
            return { authenticated: false, error: 'User not found' };
        }

        const roleCode = (user.role as RoleCode) || 'guest';
        const role = getRole(roleCode);

        return {
            authenticated: true,
            userId,
            email: user.email,
            roleCode,
            moduleAccess: role.moduleAccess,
        };
    } catch (error) {
        console.error('[verifyAuth] Error:', error);
        return { authenticated: false, error: 'Authentication failed' };
    }
}

/**
 * Verificar si el usuario tiene acceso a un módulo específico
 * @param authResult - Resultado de verifyAuth()
 * @param module - Módulo requerido (inventory, cms, blog, users, settings)
 * @param minLevel - Nivel mínimo requerido (default: 'view')
 */
export function checkModuleAccess(
    authResult: AuthResult,
    module: FeatureModule,
    minLevel: AccessLevel = 'view'
): boolean {
    if (!authResult.authenticated || !authResult.moduleAccess) {
        return false;
    }
    return hasModuleAccess(authResult.moduleAccess, module, minLevel);
}

/**
 * Verificar si el usuario es admin o super_admin
 */
export function isAdminOrSuper(authResult: AuthResult): boolean {
    if (!authResult.authenticated) return false;
    return authResult.roleCode === 'admin' || authResult.roleCode === 'super_admin';
}

/**
 * Respuesta de error de autenticación estándar
 */
export function unauthorizedResponse(message = 'No autorizado') {
    return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Respuesta de error de permisos estándar
 */
export function forbiddenResponse(message = 'Sin permisos suficientes') {
    return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Helper para proteger una API route completa
 * Uso:
 * ```
 * const auth = await requireAuth();
 * if (auth.error) return auth.error;
 * // auth.result contiene AuthResult
 * ```
 */
export async function requireAuth(): Promise<{ result: AuthResult; error?: NextResponse }> {
    const result = await verifyAuth();

    if (!result.authenticated) {
        return { result, error: unauthorizedResponse(result.error) };
    }

    return { result };
}

/**
 * Helper para requerir acceso a un módulo específico
 * Uso:
 * ```
 * const auth = await requireModuleAccess('users', 'manage');
 * if (auth.error) return auth.error;
 * ```
 */
export async function requireModuleAccess(
    module: FeatureModule,
    minLevel: AccessLevel = 'view'
): Promise<{ result: AuthResult; error?: NextResponse }> {
    const { result, error } = await requireAuth();

    if (error) return { result, error };

    if (!checkModuleAccess(result, module, minLevel)) {
        return {
            result,
            error: forbiddenResponse(`Requiere acceso '${minLevel}' al módulo '${module}'`)
        };
    }

    return { result };
}
