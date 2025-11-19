"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export function ConditionalNavbar() {
    const pathname = usePathname() || "";

    // Oculta la navbar del landing cuando estamos en /admin (o rutas anidadas)
    if (pathname.startsWith("/admin")) return null;

    return <Navbar />;
}
