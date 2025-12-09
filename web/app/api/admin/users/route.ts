import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRole, type RoleCode, ROLES } from "@/features/auth";
import { hasPermission as checkPermission, type Permission } from "@/features/auth/domain/value-objects/permission";

// Para server-side (Docker interno): usa STRAPI_API_URL
const STRAPI_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

// Helper to get token from cookies
async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("fablab_token")?.value || null;
}

// Verify user has permission
async function verifyPermission(token: string, permission: Permission): Promise<{ allowed: boolean; user?: { role: { name: string; code: RoleCode } } }> {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        return { allowed: false };
    }

    const strapiUser = await response.json();

    // Email-based admin detection (same approach as login route)
    const adminEmails = (process.env.ADMIN_EMAILS || 'testadmin@fablab.com,admin2@fablab.com,admin3@fablab.com').split(',').map(e => e.trim().toLowerCase());
    const isAdmin = adminEmails.includes(strapiUser.email.toLowerCase());
    const role = getRole(isAdmin ? 'super_admin' : 'guest');

    // Use checkPermission to properly handle wildcard (*)
    const allowed = checkPermission(role.permissions, permission);

    return { allowed, user: { role: { name: role.name, code: role.code } } };
}

// GET - List all users
export async function GET() {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed } = await verifyPermission(token, 'users.users.read:all');
        if (!allowed) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        // Strapi /api/users needs admin permission - use our internal list approach
        // For now, fetch from /api/users with our token (which will fail) and handle gracefully
        // TODO: Use proper admin token or direct DB access

        const response = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            // Strapi doesn't allow listing users with normal API token
            // Return empty list with message for now
            console.log('[GET /api/admin/users] Strapi returned', response.status);
            return NextResponse.json({
                users: [],
                message: "Configure Strapi permissions for user listing"
            });
        }

        const strapiUsers = await response.json();

        // Admin emails list (same as login/session)
        const adminEmails = (process.env.ADMIN_EMAILS || 'testadmin@fablab.com,admin2@fablab.com,admin3@fablab.com').split(',').map(e => e.trim().toLowerCase());

        // Map to our User format with email-based role detection
        const users = strapiUsers.map((u: { id: number; username: string; email: string; blocked: boolean; confirmed: boolean; createdAt: string }) => {
            const isAdmin = adminEmails.includes(u.email.toLowerCase());
            return {
                id: String(u.id),
                name: u.username,
                email: u.email,
                role: getRole(isAdmin ? 'super_admin' : 'guest'),
                isActive: !u.blocked && u.confirmed,
                createdAt: u.createdAt,
            };
        });

        return NextResponse.json({ users });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// Helper to check if requester can assign a role
function canAssignRole(requesterRoleCode: RoleCode, targetRoleCode: RoleCode): boolean {
    const hierarchy: RoleCode[] = ['guest', 'admin', 'super_admin'];
    const requesterLevel = hierarchy.indexOf(requesterRoleCode);
    const targetLevel = hierarchy.indexOf(targetRoleCode);

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
    roleCode?: RoleCode;
    sendConfirmationEmail?: boolean;
};

// POST - Create user
export async function POST(req: Request) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { allowed, user: requester } = await verifyPermission(token, 'users.users.create:all');
        if (!allowed || !requester) {
            return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
        }

        const body = await req.json() as CreateUserBody;
        const { username, email, password, roleCode = 'guest', sendConfirmationEmail = false } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        // Check role assignment permission - use the code we already have
        if (!canAssignRole(requester.role.code, roleCode)) {
            return NextResponse.json({ error: "No puedes asignar ese rol" }, { status: 403 });
        }

        // Get Strapi role ID
        const strapiRoleId = await getStrapiRoleId(token, ROLES[roleCode].name);

        // Create user using Strapi's public registration endpoint
        const createData = {
            username,
            email,
            password,
        };

        const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || "Error al crear usuario");
        }

        const result = await response.json();
        const newUser = result.user; // Strapi register returns { jwt, user }

        return NextResponse.json({
            user: {
                id: String(newUser.id),
                name: newUser.username,
                email: newUser.email,
                role: getRole(roleCode),
                isActive: newUser.confirmed,
                createdAt: newUser.createdAt,
            }
        }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
