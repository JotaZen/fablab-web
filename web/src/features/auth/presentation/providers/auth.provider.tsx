"use client";

/**
 * AuthProvider - Context de React para autenticación
 * 
 * Usa las APIs internas de Next.js (/api/auth/*) que internamente
 * seleccionan el adapter correcto (Strapi, Sanctum, etc.)
 */

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import type { User } from "../../domain/entities/user";
import type { Credentials } from "../../domain/entities/session";
import { AuthError } from "../../domain/errors/auth-error";

// ============================================================
// TYPES
// ============================================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Key para sessionStorage
const USER_STORAGE_KEY = 'fablab_auth_user';

// ============================================================
// HELPERS
// ============================================================

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    // Reconstruir Date
    if (data.createdAt) data.createdAt = new Date(data.createdAt);
    return data;
  } catch {
    return null;
  }
}

function storeUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch { }
}

// ============================================================
// API CALLS (a las rutas internas de Next.js)
// ============================================================

async function apiLogin(credentials: Credentials): Promise<{ user: User; jwt: string }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(data.error || 'Error de login', 'INVALID_CREDENTIALS');
  }

  return data;
}

async function apiGetSession(): Promise<{ user: User | null }> {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
    credentials: 'include', // Incluir cookies
  });

  if (!response.ok) {
    return { user: null };
  }

  return response.json();
}

async function apiLogout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = user !== null;

  // Inicializar - Verificar sesión con el servidor
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    console.log('[AuthProvider] Inicializando...');

    const init = async () => {
      // Cargar del storage primero para UI inmediata
      const storedUser = getStoredUser();
      console.log('[AuthProvider] Usuario en storage:', storedUser?.email ?? 'ninguno');

      if (storedUser) {
        setUser(storedUser);
      }

      // Verificar con servidor vía API interna
      try {
        console.log('[AuthProvider] Verificando sesión con servidor...');
        const { user: serverUser } = await apiGetSession();
        console.log('[AuthProvider] Respuesta servidor:', serverUser?.email ?? 'sin sesión');

        if (serverUser) {
          setUser(serverUser);
          storeUser(serverUser);
        } else if (storedUser) {
          // El servidor dice que no hay sesión, limpiar
          console.log('[AuthProvider] Servidor sin sesión, limpiando storage');
          setUser(null);
          storeUser(null);
        }
      } catch (err) {
        console.error('[AuthProvider] Error verificando sesión:', err);
      } finally {
        console.log('[AuthProvider] Inicialización completa, isLoading = false');
        setIsLoading(false);
      }
    };

    init();
  }, [initialized]);

  const login = useCallback(async (credentials: Credentials): Promise<boolean> => {
    setError(null);
    try {
      const { user: loggedUser } = await apiLogin(credentials);
      setUser(loggedUser);
      storeUser(loggedUser);
      return true;
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(err instanceof Error ? err.message : 'Error desconocido', 'NETWORK_ERROR');
      setError(authError);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      storeUser(null);
      setError(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { user: serverUser } = await apiGetSession();
      setUser(serverUser);
      storeUser(serverUser);
    } catch {
      setUser(null);
      storeUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.role?.permissions) return false;
    return user.role.permissions.includes(permission as never);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refresh,
    clearError,
    hasPermission,
  }), [user, isAuthenticated, isLoading, error, login, logout, refresh, clearError, hasPermission]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOKS
// ============================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
