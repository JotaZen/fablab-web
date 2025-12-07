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

// GET - List all users
export async function GET() {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed } = await verifyPermission(token, 'users.read');
        if (!allowed) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        // Fetch users from Strapi
        const response = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Error al obtener usuarios");
        }

        const strapiUsers = await response.json();

        // Map to our User format
        const users = strapiUsers.map((u: { id: number; username: string; email: string; blocked: boolean; confirmed: boolean; createdAt: string; role?: { name: string } }) => ({
            id: String(u.id),
            name: u.username,
            email: u.email,
            role: getRole(u.role?.name ?? 'visitor'),
            isActive: !u.blocked && u.confirmed,
            createdAt: u.createdAt,
        }));

        return NextResponse.json({ users });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// Helper to check if requester can assign a role
function canAssignRole(requesterRoleId: RoleId, targetRoleId: RoleId): boolean {
    const hierarchy: RoleId[] = ['public', 'visitor', 'operator', 'coordinator', 'admin', 'super_admin'];
    const requesterLevel = hierarchy.indexOf(requesterRoleId);
    const targetLevel = hierarchy.indexOf(targetRoleId);

    // Can assign same level or lower
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

type CreateUserBody = {
    username: string;
    email: string;
    password: string;
    roleId?: RoleId;
    sendConfirmationEmail?: boolean;
};

// POST - Create user
export async function POST(req: Request) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed, user: requester } = await verifyPermission(token, 'users.create');
        if (!allowed || !requester) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        const body = await req.json() as CreateUserBody;
        const { username, email, password, roleId = 'visitor', sendConfirmationEmail = false } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        // Check role assignment permission
        const requesterRole = getRole(requester.role?.name ?? 'visitor');
        if (!canAssignRole(requesterRole.id, roleId)) {
            return NextResponse.json({ error: "No puedes asignar ese rol" }, { status: 403 });
        }

        // Get Strapi role ID
        const strapiRoleId = await getStrapiRoleId(token, ROLES[roleId].name);

        // Create user in Strapi
        const createData: Record<string, unknown> = {
            username,
            email,
            password,
            confirmed: !sendConfirmationEmail,
            blocked: false,
        };

        if (strapiRoleId) {
            createData.role = strapiRoleId;
        }

        const response = await fetch(`${STRAPI_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || "Error al crear usuario");
        }

        const newUser = await response.json();

        return NextResponse.json({
            user: {
                id: String(newUser.id),
                name: newUser.username,
                email: newUser.email,
                role: getRole(roleId),
                isActive: !newUser.blocked && newUser.confirmed,
                createdAt: newUser.createdAt,
            }
        }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
