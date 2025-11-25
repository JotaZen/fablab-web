"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { AuthUser, LoginCredentials, AuthState } from "@/features/auth/domain/types";

/**
 * Contexto de Autenticación
 * 
 * Proporciona:
 * - Estado de usuario y sesión
 * - Funciones de login/logout
 * - Estado de carga y errores
 */

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  /**
   * Verifica la sesión actual con el servidor
   */
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json() as { user: AuthUser | null };
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  /**
   * Inicializa la sesión al cargar
   */
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await refreshSession();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [refreshSession]);

  /**
   * Inicia sesión
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await res.json() as { user?: AuthUser; error?: string };

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setIsLoading(false);
        return false;
      }

      setUser(data.user || null);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError("Error de conexión. Verifica que el servidor esté disponible.");
      setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Cierra sesión
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      clearError,
      refreshSession,
    }),
    [user, isAuthenticated, isLoading, error, login, logout, clearError, refreshSession]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
