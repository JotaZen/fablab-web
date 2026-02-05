"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { AdminSidebar } from "@/shared/layout/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Verificar si el usuario es admin
    const isAdmin = user?.role?.code === 'super_admin' || 
                    user?.role?.code === 'admin' || 
                    (user as any)?.payloadRole === 'admin';

    // Redirigir si no está autenticado (después del render)
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Redirigir usuarios no-admin a equipment-usage si están en /admin exacto
    useEffect(() => {
        if (!isLoading && isAuthenticated && !isAdmin && pathname === '/admin') {
            router.replace("/admin/equipment-usage");
        }
    }, [isLoading, isAuthenticated, isAdmin, pathname, router]);

    // Mientras verifica autenticación inicial
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }

    // Si no está autenticado, mostrar loading mientras redirige
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Redirigiendo...</p>
            </div>
        );
    }

    // Si es usuario no-admin en /admin, mostrar loading mientras redirige
    if (!isAdmin && pathname === '/admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
