"use client";

import React from "react";
import { useAuth, AuthProvider } from "@/features/auth";
import { AdminSidebar } from "@/shared/layout/admin/sidebar";
import { AdminHeader } from "@/shared/layout/admin/admin-header";
import { AdminLoading } from "@/shared/layout/admin/admin-loading";
import { LoginPage } from "@/features/auth/presentation/login-page";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    // Mientras verifica autenticación inicial
    if (isLoading) {
        return <AdminLoading />;
    }

    // Si no está autenticado, mostrar login inline (sin redirect)
    if (!isAuthenticated) {
        return <LoginPage inline />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </AuthProvider>
    );
}
