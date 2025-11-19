"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/shared/auth/RequireAuth";
import { useAuth } from "@/shared/auth/useAuth";

export default function AdminProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if (loading) return <div className="mt-16">Cargando sesión...</div>;
    if (!user) return null;

    return (
        <RequireAuth>
            <div className="mt-16 rounded bg-white p-8 shadow">
                <h1 className="mb-4 text-2xl font-semibold">Admin — Perfil</h1>
                <div className="space-y-2">
                    <div><strong>ID:</strong> {String(user.id)}</div>
                    <div><strong>Usuario:</strong> {user.username ?? "-"}</div>
                    <div><strong>Email:</strong> {user.email ?? "-"}</div>
                    <div><strong>Roles:</strong> {(user.roles || []).join(", ")}</div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={async () => {
                            await logout();
                            router.push("/admin");
                        }}
                        className="rounded bg-red-600 px-4 py-2 text-white"
                    >Cerrar sesión</button>
                </div>
            </div>
        </RequireAuth>
    );
}
