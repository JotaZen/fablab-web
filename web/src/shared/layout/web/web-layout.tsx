"use client"

import React from 'react'
import { ConditionalNavbar } from './conditional-navbar'
import { Footer } from './footer'
import { AuthProvider } from '@/shared/auth/AuthProvider'
import { ConditionalFooter } from '../conditional-footer'
import { WhatsAppButton } from '@/shared/ui/buttons/whatsapp-button'

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
            {/* Botón flotante de WhatsApp */}
            <WhatsAppButton
                phoneNumber="56912345678"
                message="Hola! Me gustaría obtener información sobre el FabLab INACAP Los Ángeles."
            />
        </AuthProvider>
    )
}

export default WebLayout
