/**
 * API de Usuario Individual - Arquitectura Hexagonal
 */

import { NextResponse } from "next/server";
import { getUserRepository } from "@/features/auth/infrastructure/factories/user-repository.factory";
import type { RoleCode } from "@/features/auth";

type Params = {
    params: Promise<{ id: string }>;
};

// GET - Get single user
export async function GET(_req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const repository = getUserRepository();

        const user = await repository.findById(id);

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error('Error fetching user:', err);
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

type UpdateUserBody = {
    username?: string;
    email?: string;
    password?: string;
    roleCode?: RoleCode;
    isActive?: boolean;
};

// PUT - Update user
export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const repository = getUserRepository();

        const body = await req.json() as UpdateUserBody;

        const user = await repository.update(id, body);

        return NextResponse.json({ user });
    } catch (err) {
        console.error('Error updating user:', err);
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(_req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const repository = getUserRepository();

        await repository.delete(id);

        return NextResponse.json({ success: true, message: "Usuario eliminado" });
    } catch (err) {
        console.error('Error deleting user:', err);
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
