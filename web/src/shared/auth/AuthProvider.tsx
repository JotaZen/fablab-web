"use client";

import React, { createContext, useEffect, useState } from "react";

/**
 * AuthProvider - Proveedor de contexto de autenticación
 *
 * Gestiona el estado global de autenticación:
 * - Usuario logueado
 * - Estado de carga
 * - Funciones login/logout
 *
 * Se inicializa verificando la sesión en /api/auth/session
 * Usa cookies para persistir el JWT
 */
export type User = {
    id: string | number;
    username?: string;
    email?: string;
    roles?: string[];
    permissions?: string[];
} | null;

export type AuthContextValue = {
    user: User;
    loading: boolean;
    isAuthenticated: boolean;
    hasPermission: (perm: string) => boolean;
    getDefaultRedirect: () => string;
    login: (creds: { identifier: string; password: string }) => Promise<User | null>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al montar, pedir sesión al servidor (usecase cliente)
        (async () => {
            try {
                const { clientGetSession } = await import("@/features/auth/application/authUseCases");
                const data = await clientGetSession();
                setUser(data.user ?? null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function login(creds: { identifier: string; password: string }) {
        const { clientLogin } = await import("@/features/auth/application/authUseCases");
        const data = await clientLogin(creds);
        setUser(data.user ?? null);
        return data.user ?? null;
    }

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
        }
    }

    const isAuthenticated = !!user;
    function hasPermission(perm: string) {
        return !!user && !!user.permissions && user.permissions.includes(perm);
    }

    function getDefaultRedirect() {
        // Prefer redirect for admin users
        if (user) {
            if (user.roles?.includes("admin") || hasPermission("admin")) return "/admin/dashboard";
            // If user has a specific dashboard permission pattern, expand here
            if (user.permissions && user.permissions.includes("iot:access")) return "/control-iot";
            // fallback to root
            return "/";
        }
        return "/auth/login";
    }

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, hasPermission, getDefaultRedirect, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
