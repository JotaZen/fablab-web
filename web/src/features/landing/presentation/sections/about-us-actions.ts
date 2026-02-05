"use server";

import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Obtiene el total de miembros activos del equipo desde Payload CMS
 */
export async function getTeamMembersCount(): Promise<number> {
  try {
    const payload = await getPayload({ config });
    
    const { totalDocs } = await payload.find({
      collection: "users",
      where: {
        showInTeam: {
          equals: true,
        },
      },
      limit: 1, // Solo necesitamos el count, no los datos
    });

    return totalDocs || 0;
  } catch (error) {
    console.error("Error getting team members count:", error);
    // Fallback a número por defecto
    return 12;
  }
}
