"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/shared/layout/admin/sidebar/sidebar";
import AdminTopNavbar from "@/shared/layout/admin/top-navbar";
import { AuthProvider } from "@/shared/auth/AuthProvider";
import { useAuth } from "@/shared/auth/useAuth";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const auth = useAuth();

    if (auth.isLoading || (!auth.user)) {
        return <div className="mt-16">Cargando sesión...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminTopNavbar onToggleSidebar={() => setCollapsed((s) => !s)} />

            <div className="pt-14 flex">
                <AdminSidebar collapsed={collapsed} />

                <main className="flex-1 p-6">
                    <div className="mx-auto max-w-6xl bg-white rounded-lg shadow p-6">
                        {children}
                    </div>
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
