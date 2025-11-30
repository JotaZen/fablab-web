"use client";

import React from "react";
import { Navbar } from "./navbar";
import { useIsProtectedRoute } from "../../auth/useIsProtectedRoute";

export function ConditionalNavbar() {
    // Usa el hook centralizado para decidir si la ruta actual es protegida
    const isProtected = useIsProtectedRoute();

    // Si la ruta es una ruta protegida (p.ej. admin), ocultamos la navbar del landing
    if (isProtected) return null;

    return <Navbar />;
}
