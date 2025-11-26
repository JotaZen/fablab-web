"use client";

import React from "react";
import { Footer } from "./web/footer";
import { useIsProtectedRoute } from "../auth/useIsProtectedRoute";

export function ConditionalFooter() {
    const isProtected = useIsProtectedRoute();

    // Oculta el footer cuando estamos en rutas protegidas (admin)
    if (isProtected) {
        return null;
    }

    return <Footer />;
}
