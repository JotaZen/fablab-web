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

function mapMember(m: any): TeamMemberUI {
  // Handle both Strapi v4 format (m.attributes) and v5 format (direct properties)
  const a = m.attributes || m;

  // Handle foto field - could be null, undefined, or have nested structure
  let image: string | undefined;
  if (a.foto?.data?.attributes) {
    // Strapi v4/v5 populated format
    image = absoluteUrl(a.foto.data.attributes.formats?.medium?.url || a.foto.data.attributes.url);
  } else if (a.foto?.url) {
    // Direct image object
    image = absoluteUrl(a.foto.url);
  } else {
    // No image or foto is null
    image = undefined;
  }

  return {
    id: m.id || m.documentId,
    name: a.nombre || '',
    role: a.cargo || undefined,
    specialty: a.especialidad || undefined,
    bio: a.bio || undefined,
    experience: a.experiencia || undefined,
    email: a.email || undefined,
    phone: a.telefono || undefined,
    linkedin: a.linkedin || undefined,
    github: a.github || undefined,
    twitter: a.twitter || undefined,
    order: a.orden || undefined,
    isDirector: a.esDirectivo ?? false,
    image,
  };
}

export async function fetchTeamMembers(): Promise<TeamMemberUI[]> {
  try {
    const res = await fetch(TEAM_MEMBERS_ENDPOINT, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`Strapi error ${res.status}`);
    const json = (await res.json()) as StrapiCollectionResponse<StrapiTeamMember>;
    return json.data.map(mapMember);
  } catch (err) {
    console.error("Error fetching team members from Strapi", err);
    return [];
  }
}
