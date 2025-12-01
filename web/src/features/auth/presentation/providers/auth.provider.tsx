"use client";

/**
 * AuthProvider - Context de React para autenticación
 */

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import type { User } from "../../domain/entities/user";
import type { Credentials } from "../../domain/entities/session";
import { AuthError } from "../../domain/errors/auth-error";
import { getAuthService } from "../../application/factories/auth-service-factory";

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
  } catch {}
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

  // Inicializar
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const init = async () => {
      // Cargar del storage primero
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      // Verificar con servidor
      try {
        const service = await getAuthService();
        const session = await service.getSession();
        
        if (session?.user) {
          setUser(session.user);
          storeUser(session.user);
        } else if (storedUser) {
          setUser(null);
          storeUser(null);
        }
      } catch (err) {
        console.error('[AuthProvider] Error verificando sesión:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [initialized]);

  const login = useCallback(async (credentials: Credentials): Promise<boolean> => {
    setError(null);
    try {
      const service = await getAuthService();
      const session = await service.login(credentials);
      setUser(session.user);
      storeUser(session.user);
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
      const service = await getAuthService();
      await service.logout();
    } finally {
      setUser(null);
      storeUser(null);
      setError(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const service = await getAuthService();
      const session = await service.getSession();
      const newUser = session?.user ?? null;
      setUser(newUser);
      storeUser(newUser);
    } catch {
      setUser(null);
      storeUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refresh,
    clearError,
  }), [user, isAuthenticated, isLoading, error, login, logout, refresh, clearError]);

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
