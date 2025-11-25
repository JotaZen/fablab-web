"use client"

import React from 'react'
import { ConditionalNavbar } from './conditional-navbar'
import { Footer } from './footer'
import { AuthProvider } from '@/shared/auth/AuthProvider'

const WebLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <AuthProvider>
            <ConditionalNavbar />
            <main className="relative">
                {children}
            </main>
            <Footer />
        </AuthProvider>
    )
}

export default WebLayout