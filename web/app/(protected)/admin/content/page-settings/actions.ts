"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";

export async function getPageSettings() {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
        slug: "equipo-page",
    });

    return {
        heroTitle: settings.heroTitle,
        heroDescription: settings.heroDescription,
        heroStats: settings.heroStats,
    };
}

export async function updatePageSettings(data: any) {
    const payload = await getPayload({ config });

    await payload.updateGlobal({
        slug: "equipo-page",
        data: {
            heroTitle: data.heroTitle,
            heroDescription: data.heroDescription,
            heroStats: data.heroStats,
        },
    });

    revalidatePath('/admin/content/page-settings');
    revalidatePath('/equipo');
    return { success: true };
}
