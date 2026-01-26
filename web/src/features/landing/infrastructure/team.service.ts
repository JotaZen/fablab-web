import { StrapiCollectionResponse, StrapiTeamMember, TeamMemberUI } from "../domain/team.types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
// Client now calls our Next.js proxy route, but keep token fallback if route is ever bypassed.
const STRAPI_API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_TOKEN ||
  process.env.STRAPI_API_TOKEN;

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};
if (STRAPI_API_TOKEN) {
  headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
}

const TEAM_MEMBERS_ENDPOINT = "/api/page/team-members";

function absoluteUrl(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}

// Mapeo desde formato del repositorio (Users) a UI
function mapRepoMember(m: any): TeamMemberUI {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    specialty: m.specialty,
    bio: m.bio,
    experience: m.experience,
    email: m.social?.email,
    phone: undefined, // No existe en users por defecto aún
    linkedin: m.social?.linkedin,
    github: m.social?.github,
    twitter: m.social?.twitter,
    order: m.order,
    isDirector: m.category === 'leadership',
    image: m.image,
  };
}

export async function fetchTeamMembers(): Promise<TeamMemberUI[]> {
  try {
    const res = await fetch(TEAM_MEMBERS_ENDPOINT, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();
    // La API ahora retorna { data: TeamMember[] } donde TeamMember es el formato del repositorio
    if (Array.isArray(json.data)) {
      return json.data.map(mapRepoMember);
    }
    return [];
  } catch (err) {
    console.error("Error fetching team members", err);
    return [];
  }
}
