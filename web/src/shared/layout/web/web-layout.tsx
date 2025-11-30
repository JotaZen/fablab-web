"use client"

import React from 'react'
import { ConditionalNavbar } from './conditional-navbar'
import { Footer } from './footer'
import { AuthProvider } from '@/shared/auth/AuthProvider'
import { ConditionalFooter } from '../conditional-footer'

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
            <ConditionalFooter />
        </AuthProvider>
    )
}

export default WebLayout