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
} | null;

export type AuthContextValue = {
    user: User;
    loading: boolean;
    login: (creds: { identifier: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al montar, pedir sesión al servidor
        (async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    type SessionResponse = { user: User | null };
                    const data = (await res.json()) as SessionResponse;
                    setUser(data.user ?? null);
                } else {
                    setUser(null);
                }
            } catch {
                // opcional: console.error(error)
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function login(creds: { identifier: string; password: string }) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds),
        });

        if (!res.ok) {
            type ErrShape = { message?: string };
            const err = (await res.json().catch(() => ({} as ErrShape))) as ErrShape;
            throw new Error(err?.message ?? "Login falló");
        }

        type LoginResponse = { user: User | null };
        const data = (await res.json()) as LoginResponse;
        setUser(data.user ?? null);
    }

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
