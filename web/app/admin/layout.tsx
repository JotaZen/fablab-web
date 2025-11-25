"use client";

import React from "react";
import { useAuth } from "@/shared/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/shared/layout/admin/sidebar";
import { AdminHeader } from "@/shared/layout/admin/admin-header";
import { AdminLoading } from "@/shared/layout/admin/admin-loading";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Mientras verifica autenticación
    if (isLoading) {
        return <AdminLoading />;
    }

    // Si no está autenticado, mostrar loading mientras redirige
    if (!isAuthenticated) {
        return <AdminLoading />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header 100% ancho arriba */}
            <AdminHeader />
            
            {/* Contenedor del sidebar + contenido */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar ocupa todo el alto restante */}
                <AdminSidebar />
                
                {/* Contenido principal */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
