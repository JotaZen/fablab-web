import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRole, type RoleId, ROLES } from "@/features/auth";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

// Helper to get token from cookies
async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("fablab_token")?.value || null;
}

// Verify user has permission
async function verifyPermission(token: string, permission: string): Promise<{ allowed: boolean; user?: { role: { name: string } } }> {
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        return { allowed: false };
    }

    const user = await response.json();
    const role = getRole(user.role?.name ?? 'visitor');
    const allowed = role.permissions.includes(permission as never);

    return { allowed, user };
}

// Helper to check if requester can manage a role
function canManageRole(requesterRoleId: RoleId, targetRoleId: RoleId): boolean {
    const hierarchy: RoleId[] = ['public', 'visitor', 'operator', 'coordinator', 'admin', 'super_admin'];
    const requesterLevel = hierarchy.indexOf(requesterRoleId);
    const targetLevel = hierarchy.indexOf(targetRoleId);

    return targetLevel <= requesterLevel;
}

// Map our roleId to Strapi role ID
async function getStrapiRoleId(token: string, roleName: string): Promise<number | null> {
    const response = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const role = data.roles?.find((r: { name: string }) =>
        r.name.toLowerCase() === roleName.toLowerCase()
    );

    return role?.id || null;
}

type RouteParams = { params: Promise<{ id: string }> };

// GET - Get user by ID
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed } = await verifyPermission(token, 'users.read');
        if (!allowed) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        const response = await fetch(`${STRAPI_URL}/api/users/${id}?populate=role`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
            }
            throw new Error("Error al obtener usuario");
        }

        const u = await response.json();

        return NextResponse.json({
            user: {
                id: String(u.id),
                name: u.username,
                email: u.email,
                role: getRole(u.role?.name ?? 'visitor'),
                isActive: !u.blocked && u.confirmed,
                createdAt: u.createdAt,
            }
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

type UpdateUserBody = {
    username?: string;
    email?: string;
    password?: string;
    roleId?: RoleId;
    isActive?: boolean;
};

// PUT - Update user
export async function PUT(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed, user: requester } = await verifyPermission(token, 'users.update');
        if (!allowed || !requester) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        const body = await req.json() as UpdateUserBody;
        const { username, email, password, roleId, isActive } = body;

        // Get current user to check role
        const currentUserRes = await fetch(`${STRAPI_URL}/api/users/${id}?populate=role`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!currentUserRes.ok) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const currentUser = await currentUserRes.json();
        const requesterRole = getRole(requester.role?.name ?? 'visitor');
        const targetCurrentRole = getRole(currentUser.role?.name ?? 'visitor');

        // Check if requester can manage this user
        if (!canManageRole(requesterRole.id, targetCurrentRole.id)) {
            return NextResponse.json({ error: "No puedes editar este usuario" }, { status: 403 });
        }

        // If changing role, check permission
        if (roleId && !canManageRole(requesterRole.id, roleId)) {
            return NextResponse.json({ error: "No puedes asignar ese rol" }, { status: 403 });
        }

        // Build update data
        const updateData: Record<string, unknown> = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (isActive !== undefined) {
            updateData.blocked = !isActive;
        }

        if (roleId) {
            const strapiRoleId = await getStrapiRoleId(token, ROLES[roleId].name);
            if (strapiRoleId) {
                updateData.role = strapiRoleId;
            }
        }

        const response = await fetch(`${STRAPI_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || "Error al actualizar usuario");
        }

        const updatedUser = await response.json();

        return NextResponse.json({
            user: {
                id: String(updatedUser.id),
                name: updatedUser.username,
                email: updatedUser.email,
                role: getRole(roleId || currentUser.role?.name || 'visitor'),
                isActive: !updatedUser.blocked && updatedUser.confirmed,
                createdAt: updatedUser.createdAt,
            }
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed, user: requester } = await verifyPermission(token, 'users.delete');
        if (!allowed || !requester) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        // Get user to check role
        const currentUserRes = await fetch(`${STRAPI_URL}/api/users/${id}?populate=role`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!currentUserRes.ok) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const currentUser = await currentUserRes.json();
        const requesterRole = getRole(requester.role?.name ?? 'visitor');
        const targetRole = getRole(currentUser.role?.name ?? 'visitor');

        // Check if requester can delete this user
        if (!canManageRole(requesterRole.id, targetRole.id)) {
            return NextResponse.json({ error: "No puedes eliminar este usuario" }, { status: 403 });
        }

        const response = await fetch(`${STRAPI_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar usuario");
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
