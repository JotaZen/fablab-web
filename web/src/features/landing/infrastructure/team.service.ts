import { StrapiCollectionResponse, StrapiTeamMember, TeamMemberUI } from "../types/team.types";

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

function mapMember(m: StrapiTeamMember): TeamMemberUI {
  const a = m.attributes;
  const image = absoluteUrl(a.foto?.data?.attributes?.formats?.medium?.url || a.foto?.data?.attributes?.url);
  return {
    id: m.id,
    name: a.nombre,
    role: a.cargo,
    specialty: a.especialidad,
    bio: a.bio,
    experience: a.experiencia,
    email: a.email,
    phone: a.telefono,
    linkedin: a.linkedin,
    github: a.github,
    twitter: a.twitter,
    order: a.orden,
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
