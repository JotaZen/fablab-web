/**
 * API de Usuarios - Arquitectura Hexagonal
 * Usa el repositorio de usuarios configurado (Payload, Strapi, etc.)
 * Protegido con verificación de módulo 'users'
 */

import { NextResponse } from "next/server";
import { getUserRepository } from "@/features/auth/infrastructure/factories/user-repository.factory";
import { requireModuleAccess } from "@/features/auth/infrastructure/api/auth-guard";
import type { RoleCode, UserModuleAccess } from "@/features/auth";

// GET - List all users (requiere 'users' con nivel 'view')
export async function GET() {
    // Verificar acceso al módulo 'users'
    const auth = await requireModuleAccess('users', 'view');
    if (auth.error) return auth.error;

    try {
        const repository = getUserRepository();
        const users = await repository.findAll();

        return NextResponse.json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

type CreateUserBody = {
    username: string;
    email: string;
    password: string;
    roleCode?: RoleCode;
    moduleAccess?: UserModuleAccess;
    sendConfirmationEmail?: boolean;
};

// POST - Create user (requiere 'users' con nivel 'manage')
export async function POST(req: Request) {
    // Verificar acceso al módulo 'users' con nivel 'manage'
    const auth = await requireModuleAccess('users', 'manage');
    if (auth.error) return auth.error;

    try {
        const repository = getUserRepository();

        const body = await req.json() as CreateUserBody;
        const { username, email, password, roleCode = 'guest', moduleAccess } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        // Check if user already exists
        const existing = await repository.findByEmail(email);
        if (existing) {
            return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
        }

        // Create user
        const user = await repository.create({
            username,
            email,
            password,
            roleCode,
            moduleAccess,
        });

        return NextResponse.json({ user }, { status: 201 });
    } catch (err) {
        console.error('Error creating user:', err);
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
