"use client";

import React, { useState } from "react";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/shared/auth/useAuth";

export function AdminTopNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
            <div className="max-w-8xl mx-auto flex items-center h-14 px-4">
                <button
                    aria-label="Toggle sidebar"
                    onClick={onToggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <button
                    aria-label="Home"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    Home
                </button>

                <div className="ml-4 font-semibold">Admin Panel</div>

                <div className="flex-1" />

                <div className="relative">
                    <button
                        onClick={() => setOpen((s) => !s)}
                        className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        <User className="w-5 h-5" />
                        <span className="hidden sm:inline">{user?.username ?? "Admin"}</span>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg py-1 z-50">
                            <a href="/admin/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">Perfil</a>
                            <button onClick={() => logout()} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AdminTopNavbar;
