"use client";

import React from 'react'
import useIsProtectedRoute from '../auth/useIsProtectedRoute'
import WebLayout from './web/web-layout'
import AdminLayout from './admin/admin-layout'
import { AuthProvider } from '@/shared/auth/AuthProvider'

const MainLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const isProtected = useIsProtectedRoute();

    // Si la ruta es una ruta protegida (p.ej. admin), ocultamos la navbar del landing
    if (isProtected) return (
        <AuthProvider>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AuthProvider>
    );

    return (
        <AuthProvider>
            <WebLayout>
                {children}
            </WebLayout>
        </AuthProvider>
    )
}

export default MainLayout