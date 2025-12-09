import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_TOKEN;

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

if (STRAPI_TOKEN) {
  headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
}

// Fallback data to avoid empty responses when CMS has no records
const fallbackTeam = [
  {
    id: 1,
    attributes: {
      nombre: "Equipo FabLab",
      cargo: "Coordinación",
      especialidad: "Innovación y prototipado",
      bio: "Equipo base de FabLab para mostrar datos de ejemplo mientras se cargan miembros en Strapi.",
      experiencia: "3 años",
      email: "contacto@fablab.local",
      linkedin: "https://www.linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      esDirectivo: true,
      orden: 1,
      foto: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      nombre: "Especialista Maker",
      cargo: "Diseñador",
      especialidad: "Diseño y fabricación digital",
      bio: "Ejemplo de miembro para previsualizar tarjetas en el frontend.",
      experiencia: "2 años",
      email: "maker@fablab.local",
      linkedin: "https://www.linkedin.com",
      esDirectivo: false,
      orden: 2,
      foto: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
          },
        },
      },
    },
  },
  {
    id: 3,
    attributes: {
      nombre: "Ingeniero IoT",
      cargo: "IoT",
      especialidad: "Electrónica y conectividad",
      bio: "Ejemplo de miembro para mostrar el layout cuando no hay datos en Strapi.",
      experiencia: "1 año",
      email: "iot@fablab.local",
      esDirectivo: false,
      orden: 3,
      foto: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          },
        },
      },
    },
  },
];

export async function GET() {
  try {
    const url = `${STRAPI_URL}/api/team-members?sort=orden:asc&populate=foto`;
    const res = await fetch(url, { headers, cache: "no-store" });

    if (!res.ok) {
      const body = await res.text();
      // If Strapi denies (403/401/500), serve fallback so frontend sigue mostrando tarjetas
      return NextResponse.json(
        {
          data: fallbackTeam,
          meta: { pagination: { total: fallbackTeam.length } },
          warning: {
            source: "strapi",
            status: res.status,
            body,
            message: "Strapi respondió error; usando datos de respaldo",
          },
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    if (Array.isArray(data?.data) && data.data.length > 0) {
      return NextResponse.json(data, { status: 200 });
    }

    // Fallback when no records exist in Strapi
    return NextResponse.json({ data: fallbackTeam, meta: { pagination: { total: fallbackTeam.length } } }, { status: 200 });
  } catch (error) {
    console.error("Error proxying team-members", error);
    // If Strapi is unreachable, return fallback data instead of error
    return NextResponse.json(
      {
        data: fallbackTeam,
        meta: { pagination: { total: fallbackTeam.length } },
        warning: {
          source: "connection_error",
          message: "No se pudo conectar con Strapi; usando datos de respaldo",
          error: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 200 }
    );
  }
}
