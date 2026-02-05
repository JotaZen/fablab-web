"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export interface EquipmentItem {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string | null;
  marca: string;
  modelo: string;
  areaTrabajo: string;
  materialesCompatibles: string[];
  estado: "Disponible" | "En uso" | "Mantenimiento";
  descripcion: string;
  especificaciones: { label: string; value: string }[];
}

export async function getEquipmentList(): Promise<EquipmentItem[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'equipment',
      limit: 100,
      depth: 2,
      overrideAccess: true,
      where: {
        status: {
          equals: 'available',
        },
      },
    });

    return result.docs.map((doc: any) => ({
      id: String(doc.id),
      nombre: doc.name,
      categoria: doc.category,
      imagen: typeof doc.featuredImage === 'object' ? doc.featuredImage?.url : null,
      marca: doc.brand || '',
      modelo: doc.model || '',
      areaTrabajo: doc.specifications?.find((s: any) => s.label?.toLowerCase().includes('área'))?.value || 'N/A',
      materialesCompatibles: doc.materials?.map((m: any) => m.material) || [],
      estado: doc.status === 'available' ? 'Disponible' : doc.status === 'maintenance' ? 'Mantenimiento' : 'En uso',
      descripcion: doc.description,
      especificaciones: doc.specifications?.map((s: any) => ({ label: s.label, value: s.value })) || [],
    }));
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
}
