"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { serverGetSessionFromToken } from "@/features/auth/infrastructure/controllers/authController";

function parseCookie(header: string | null, name: string) {
    if (!header) return undefined;
    const pairs = header.split(";").map((p) => p.trim());
    for (const p of pairs) {
        const [k, ...v] = p.split("=");
        if (k === name) return decodeURIComponent(v.join("="));
    }
    return undefined;
}

// Server component que decide la redirección para /admin
// Lee la cookie `fablab_token` y valida el token directamente contra Strapi
export default async function AdminPage() {
    const h = await headers();
    const cookieHeader = h.get("cookie") || "";
    const token = parseCookie(cookieHeader, "fablab_token");

    if (!token) {
        return redirect("/auth/login");
    }

    try {
        const { user } = await serverGetSessionFromToken(token);
        if (user) return redirect("/admin/dashboard");
        return redirect("/auth/login");
    } catch (err) {
        return redirect("/auth/login");
    }
}
