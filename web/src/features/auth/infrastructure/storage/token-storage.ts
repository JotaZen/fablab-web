/**
 * TokenStorage - Almacenamiento unificado de token JWT
 * 
 * Guarda el token tanto en localStorage como en cookie para:
 * - localStorage: Persistencia del lado del cliente
 * - Cookie: Acceso desde middleware de Next.js
 */

const TOKEN_KEY = 'fablab_jwt';
const COOKIE_NAME = 'fablab_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos

export interface ITokenStorage {
    getToken(): string | null;
    setToken(token: string): void;
    clearToken(): void;
    isTokenExpired(): boolean;
}

/**
 * Parsear el payload de un JWT sin verificar la firma
 */
function parseJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/**
 * Verificar si el token JWT ha expirado
 */
function isExpired(token: string): boolean {
    const payload = parseJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') return false;
    // exp está en segundos, Date.now() en milisegundos
    return Date.now() >= payload.exp * 1000;
}

/**
 * Obtener token de localStorage
 */
function getFromStorage(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

/**
 * Obtener token de cookie
 */
function getFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    try {
        const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
        return match ? decodeURIComponent(match[1]) : null;
    } catch {
        return null;
    }
}

/**
 * Guardar token en localStorage
 */
function saveToStorage(token: string): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        console.warn('[TokenStorage] No se pudo guardar en localStorage');
    }
}

/**
 * Guardar token en cookie
 */
function saveToCookie(token: string): void {
    if (typeof document === 'undefined') return;
    try {
        const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString();
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
    } catch {
        console.warn('[TokenStorage] No se pudo guardar en cookie');
    }
}

/**
 * Eliminar token de localStorage
 */
function clearFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch { }
}

/**
 * Eliminar cookie
 */
function clearCookie(): void {
    if (typeof document === 'undefined') return;
    try {
        document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch { }
}

// ============================================================
// API Pública
// ============================================================

export const TokenStorage: ITokenStorage = {
    /**
     * Obtener token, primero de localStorage, luego de cookie
     */
    getToken(): string | null {
        const fromStorage = getFromStorage();
        if (fromStorage) {
            // Verificar si expiró
            if (isExpired(fromStorage)) {
                this.clearToken();
                return null;
            }
            return fromStorage;
        }

        const fromCookie = getFromCookie();
        if (fromCookie) {
            if (isExpired(fromCookie)) {
                this.clearToken();
                return null;
            }
            // Sincronizar a localStorage
            saveToStorage(fromCookie);
            return fromCookie;
        }

        return null;
    },

    /**
     * Guardar token en ambos lugares
     */
    setToken(token: string): void {
        saveToStorage(token);
        saveToCookie(token);
    },

    /**
     * Eliminar token de ambos lugares
     */
    clearToken(): void {
        clearFromStorage();
        clearCookie();
    },

    /**
     * Verificar si el token actual está expirado
     */
    isTokenExpired(): boolean {
        const token = getFromStorage() || getFromCookie();
        if (!token) return true;
        return isExpired(token);
    },
};

export default TokenStorage;
