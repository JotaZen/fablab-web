"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./web/footer";

export function ConditionalFooter() {
    const pathname = usePathname() || "";

    // Oculta el footer cuando estamos en /admin o /login
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
        return null;
    }

    return <Footer />;
}
