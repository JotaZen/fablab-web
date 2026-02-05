"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface Equipment {
  id: string;
  name: string;
  category: string;
  status: "available" | "in-use" | "maintenance";
  quantity: number;
  location: string;
  currentUserId?: string;
  currentUserName?: string;
  estimatedEndTime?: string;
}

interface EquipmentRequest {
  id: string;
  equipmentName: string;
  description: string;
  quantity: number;
  justification: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedByAvatar?: string;
  requestedById?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
}

interface EquipmentUsageRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  startTime: string;
  endTime?: string;
  estimatedDuration: string;
  description?: string;
  status: "active" | "completed";
}

/**
 * Obtener el usuario actual
 */
async function getCurrentUser() {
  try {
    const payload = await getPayload({ config });
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value || cookieStore.get("fablab_token")?.value;
    
    if (token) {
      const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) });
      if (user) {
        // Mantener el ID en su tipo original (número) para relaciones de Payload
        return {
          id: user.id,
          idString: String(user.id),
          name: (user as any).name || user.email || "Usuario",
          avatar: typeof (user as any).avatar === 'object' ? (user as any).avatar?.url : undefined,
          isAdmin: (user as any).role === 'admin',
        };
      }
    }
  } catch {
    // Ignorar errores de autenticación
  }
  return null;
}

/**
 * Verificar si el usuario actual es administrador
 */
export async function getCurrentUserIsAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin ?? false;
}

/**
 * Obtener equipos tecnológicos activos del inventario
 */
export async function getActiveEquipment(): Promise<Equipment[]> {
  const payload = await getPayload({ config });
  
  // PRIMERO: Obtener los usos activos (esto siempre debe funcionar)
  let usageMap = new Map<string, any>();
  
  try {
    const { docs: allUsages } = await payload.find({
      collection: "equipment-usage",
      limit: 500,
      depth: 1,
    });

    // Filtrar solo los activos
    const activeUsages = allUsages.filter((u: any) => u.status === "active");
    console.log("[EquipmentUsage] Usos activos:", activeUsages.length);

    // Crear mapa de equipos en uso
    for (const usage of activeUsages) {
      const equipmentId = usage.equipmentId as string;
      usageMap.set(equipmentId, {
        userId: typeof usage.user === 'object' ? String((usage.user as any).id) : String(usage.user),
        userName: usage.userName || (typeof usage.user === 'object' ? (usage.user as any).name : 'Usuario'),
        startTime: usage.startTime,
        estimatedDuration: usage.estimatedDuration,
      });
    }
    console.log("[EquipmentUsage] Equipos en uso:", Array.from(usageMap.keys()));
  } catch (error) {
    console.error("[EquipmentUsage] Error obteniendo usos activos:", error);
  }

  // SEGUNDO: Intentar obtener del inventario real
  try {
    const { docs: items } = await payload.find({
      collection: "inventory-items",
      where: {
        and: [
          {
            or: [
              { category: { equals: "equipment" } },
              { category: { equals: "electronics" } },
              { category: { equals: "tools" } },
              { type: { contains: "equipo" } },
            ],
          },
          {
            status: { not_equals: "discontinued" },
          },
        ],
      },
      limit: 200,
      depth: 1,
    });

    if (items.length > 0) {
      return items.map((item: any) => {
        const activeUsage = usageMap.get(String(item.id));
        return {
          id: String(item.id),
          name: item.name || item.title || "Sin nombre",
          category: mapCategory(item.category || item.type),
          status: activeUsage ? "in-use" : mapStatus(item.status, item.quantity),
          quantity: item.quantity || item.stock || 1,
          location: item.location || item.ubicacion || "FabLab Principal",
          currentUserId: activeUsage?.userId,
          currentUserName: activeUsage?.userName,
          estimatedEndTime: activeUsage ? calculateEndTime(activeUsage.startTime, activeUsage.estimatedDuration) : undefined,
        };
      });
    }
  } catch {
    // Si no existe la colección inventory-items, usar equipos por defecto
    console.log("[EquipmentUsage] Colección inventory-items no existe, usando equipos por defecto");
  }

  // TERCERO: Usar equipos por defecto CON el usageMap correcto
  console.log("[EquipmentUsage] Usando equipos por defecto con", usageMap.size, "equipos en uso");
  return getDefaultEquipment(usageMap);
}

/**
 * Obtener solicitudes de equipos del usuario actual
 */
export async function getEquipmentRequests(): Promise<EquipmentRequest[]> {
  try {
    const payload = await getPayload({ config });
    const user = await getCurrentUser();

    const { docs: requests } = await payload.find({
      collection: "equipment-requests",
      where: user ? { requestedBy: { equals: user.id } } : {},
      sort: "-createdAt",
      limit: 50,
      depth: 2,
    });

    return requests.map((req: any) => {
      // Obtener avatar del solicitante
      let requestedByAvatar: string | undefined;
      if (typeof req.requestedBy === 'object' && req.requestedBy?.avatar) {
        const avatar = req.requestedBy.avatar;
        requestedByAvatar = typeof avatar === 'object' ? avatar.url : avatar;
      }

      return {
        id: String(req.id),
        equipmentName: req.equipmentName,
        description: req.description || "",
        quantity: req.quantity || 1,
        justification: req.justification || "",
        status: req.status || "pending",
        requestedBy: typeof req.requestedBy === "object" ? req.requestedBy?.name : req.requestedBy || "Usuario",
        requestedByAvatar,
        requestedById: typeof req.requestedBy === "object" ? String(req.requestedBy?.id) : undefined,
        reviewedBy: typeof req.reviewedBy === "object" ? req.reviewedBy?.name : req.reviewedBy,
        reviewNotes: req.reviewNotes,
        createdAt: req.createdAt,
      };
    });
  } catch (error) {
    console.error("[EquipmentUsage] Error obteniendo solicitudes:", error);
    return [];
  }
}

/**
 * Obtener TODAS las solicitudes de equipos (solo admin)
 */
export async function getAllEquipmentRequests(): Promise<EquipmentRequest[]> {
  try {
    const user = await getCurrentUser();
    
    if (!user?.isAdmin) {
      console.warn("[EquipmentRequests] Usuario no es admin");
      return [];
    }

    const payload = await getPayload({ config });

    const { docs: requests } = await payload.find({
      collection: "equipment-requests",
      sort: "-createdAt",
      limit: 200,
      depth: 2,
    });

    return requests.map((req: any) => {
      // Obtener avatar del solicitante
      let requestedByAvatar: string | undefined;
      if (typeof req.requestedBy === 'object' && req.requestedBy?.avatar) {
        const avatar = req.requestedBy.avatar;
        requestedByAvatar = typeof avatar === 'object' ? avatar.url : avatar;
      }

      return {
        id: String(req.id),
        equipmentName: req.equipmentName,
        description: req.description || "",
        quantity: req.quantity || 1,
        justification: req.justification || "",
        status: req.status || "pending",
        requestedBy: typeof req.requestedBy === "object" ? req.requestedBy?.name || req.requestedBy?.email : "Usuario",
        requestedByAvatar,
        requestedById: typeof req.requestedBy === "object" ? String(req.requestedBy?.id) : undefined,
        reviewedBy: typeof req.reviewedBy === "object" ? req.reviewedBy?.name : req.reviewedBy,
        reviewNotes: req.reviewNotes,
        createdAt: req.createdAt,
      };
    });
  } catch (error) {
    console.error("[EquipmentRequests] Error obteniendo todas las solicitudes:", error);
    return [];
  }
}

/**
 * Actualizar el estado de una solicitud (solo admin)
 */
export async function updateRequestStatus(
  requestId: string, 
  status: "pending" | "approved" | "rejected",
  reviewNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, error: "Debes iniciar sesión" };
    }

    if (!user.isAdmin) {
      return { success: false, error: "Solo los administradores pueden gestionar solicitudes" };
    }

    const payload = await getPayload({ config });

    await payload.update({
      collection: "equipment-requests",
      id: requestId,
      data: {
        status,
        reviewedBy: user.id,
        reviewNotes: reviewNotes || undefined,
      },
    });

    revalidatePath("/admin/solicitudes");
    revalidatePath("/admin/equipment-usage");
    return { success: true };
  } catch (error) {
    console.error("[EquipmentRequests] Error actualizando solicitud:", error);
    return { success: false, error: "Error al actualizar la solicitud" };
  }
}

/**
 * Obtener historial de usos de equipos
 */
export async function getUsageHistory(): Promise<EquipmentUsageRecord[]> {
  try {
    const payload = await getPayload({ config });

    const { docs: usages } = await payload.find({
      collection: "equipment-usage",
      sort: "-startTime",
      limit: 100,
      depth: 1,
    });

    return usages.map((usage: any) => ({
      id: String(usage.id),
      equipmentId: usage.equipmentId,
      equipmentName: usage.equipmentName,
      userId: typeof usage.user === 'object' ? String(usage.user.id) : String(usage.user),
      userName: usage.userName || (typeof usage.user === 'object' ? (usage.user as any).name : 'Usuario'),
      userAvatar: typeof usage.user === 'object' && (usage.user as any).avatar ? 
        (typeof (usage.user as any).avatar === 'object' ? (usage.user as any).avatar.url : (usage.user as any).avatar) : undefined,
      startTime: usage.startTime,
      endTime: usage.endTime,
      estimatedDuration: usage.estimatedDuration,
      description: usage.description,
      status: usage.status,
    }));
  } catch (error) {
    console.error("[EquipmentUsage] Error obteniendo historial:", error);
    return [];
  }
}

/**
 * Usar un equipo (marcarlo como en uso)
 */
export async function startEquipmentUsage(data: {
  equipmentId: string;
  equipmentName: string;
  estimatedDuration: string;
  description?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config });
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, error: "Debes iniciar sesión para usar un equipo" };
    }

    // Verificar que el equipo no esté ya en uso
    const { docs: existingUsage } = await payload.find({
      collection: "equipment-usage",
      where: {
        and: [
          { equipmentId: { equals: data.equipmentId } },
          { status: { equals: "active" } },
        ],
      },
      limit: 1,
    });

    if (existingUsage.length > 0) {
      return { success: false, error: "Este equipo ya está en uso" };
    }

    console.log("[EquipmentUsage] Registrando uso - equipmentId:", data.equipmentId, "equipmentName:", data.equipmentName);

    // Registrar el uso en la base de datos
    await payload.create({
      collection: "equipment-usage",
      data: {
        equipmentId: data.equipmentId,
        equipmentName: data.equipmentName,
        user: user.id, // ID numérico para relación de Payload
        userName: user.name,
        startTime: new Date().toISOString(),
        estimatedDuration: data.estimatedDuration,
        description: data.description || "",
        status: "active",
      },
    });

    revalidatePath("/admin/equipment-usage");
    return { success: true };
  } catch (error) {
    console.error("[EquipmentUsage] Error usando equipo:", error);
    return { success: false, error: "Error al registrar el uso del equipo" };
  }
}

/**
 * Liberar un equipo (marcarlo como disponible)
 */
export async function releaseEquipment(equipmentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config });
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, error: "Debes iniciar sesión" };
    }

    // Buscar el uso activo
    const { docs: activeUsages } = await payload.find({
      collection: "equipment-usage",
      where: {
        and: [
          { equipmentId: { equals: equipmentId } },
          { status: { equals: "active" } },
        ],
      },
      limit: 1,
      depth: 1,
    });

    if (activeUsages.length === 0) {
      return { success: false, error: "Este equipo no está en uso" };
    }

    const activeUsage = activeUsages[0];
    const usageUserId = typeof activeUsage.user === 'object' ? String((activeUsage.user as any).id) : String(activeUsage.user);

    // Verificar que el usuario sea quien tiene el equipo
    if (usageUserId !== user.idString) {
      return { success: false, error: "Solo la persona que usa el equipo puede liberarlo" };
    }

    // Actualizar el registro para marcarlo como completado
    await payload.update({
      collection: "equipment-usage",
      id: activeUsage.id,
      data: {
        status: "completed",
        endTime: new Date().toISOString(),
      },
    });

    revalidatePath("/admin/equipment-usage");
    return { success: true };
  } catch (error) {
    console.error("[EquipmentUsage] Error liberando equipo:", error);
    return { success: false, error: "Error al liberar el equipo" };
  }
}

/**
 * Obtener ID del usuario actual (como string para comparaciones en UI)
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.idString || null;
}

/**
 * Enviar una solicitud de equipo nuevo
 */
export async function submitEquipmentRequest(data: {
  equipmentName: string;
  description: string;
  quantity: number;
  justification: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config });
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "Debes iniciar sesión para enviar una solicitud" };
    }

    if (!data.equipmentName || !data.justification) {
      return { success: false, error: "El nombre del equipo y la justificación son obligatorios" };
    }

    await payload.create({
      collection: "equipment-requests",
      data: {
        equipmentName: data.equipmentName,
        description: data.description || "",
        quantity: data.quantity || 1,
        justification: data.justification,
        status: "pending",
        requestedBy: user.id, // ID numérico para relación de Payload
      },
    });

    revalidatePath("/admin/equipment-usage");
    return { success: true };
  } catch (error) {
    console.error("[EquipmentUsage] Error enviando solicitud:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al enviar la solicitud" 
    };
  }
}

/**
 * Cambiar estado de mantenimiento de un equipo (solo admin)
 */
export async function toggleEquipmentMaintenance(equipmentId: string, setMaintenance: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, error: "Debes iniciar sesión" };
    }

    if (!user.isAdmin) {
      return { success: false, error: "Solo los administradores pueden cambiar el estado de mantenimiento" };
    }

    const payload = await getPayload({ config });

    // Si se está poniendo en mantenimiento, primero verificar que no esté en uso
    if (setMaintenance) {
      const { docs: activeUsages } = await payload.find({
        collection: "equipment-usage",
        where: {
          and: [
            { equipmentId: { equals: equipmentId } },
            { status: { equals: "active" } },
          ],
        },
        limit: 1,
      });

      if (activeUsages.length > 0) {
        return { success: false, error: "No se puede poner en mantenimiento un equipo que está en uso" };
      }
    }

    // Crear o actualizar registro de mantenimiento
    const maintenanceCollectionExists = await checkCollectionExists(payload, "equipment-maintenance");
    
    if (maintenanceCollectionExists) {
      if (setMaintenance) {
        await payload.create({
          collection: "equipment-maintenance",
          data: {
            equipmentId,
            startDate: new Date().toISOString(),
            status: "active",
            notes: "Puesto en mantenimiento por administrador",
          },
        });
      } else {
        // Buscar y cerrar el mantenimiento activo
        const { docs: maintenances } = await payload.find({
          collection: "equipment-maintenance",
          where: {
            and: [
              { equipmentId: { equals: equipmentId } },
              { status: { equals: "active" } },
            ],
          },
          limit: 1,
        });

        if (maintenances.length > 0) {
          await payload.update({
            collection: "equipment-maintenance",
            id: maintenances[0].id,
            data: {
              status: "completed",
              endDate: new Date().toISOString(),
            },
          });
        }
      }
    }

    // Guardar estado en localStorage del servidor usando una colección simple
    // Por ahora usamos el estado en memoria que se sincroniza con getActiveEquipment
    maintenanceStatus.set(equipmentId, setMaintenance);

    revalidatePath("/admin/equipment-usage");
    return { success: true };
  } catch (error) {
    console.error("[EquipmentUsage] Error cambiando mantenimiento:", error);
    return { success: false, error: "Error al cambiar el estado de mantenimiento" };
  }
}

// Mapa en memoria para estados de mantenimiento (para equipos por defecto)
const maintenanceStatus = new Map<string, boolean>();

async function checkCollectionExists(payload: any, collectionSlug: string): Promise<boolean> {
  try {
    await payload.find({ collection: collectionSlug, limit: 1 });
    return true;
  } catch {
    return false;
  }
}

// Helpers
function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    equipment: "Computación",
    electronics: "Electrónica",
    tools: "Herramientas",
    "3d-printing": "Impresión 3D",
    consumables: "Otros",
  };
  return categoryMap[category?.toLowerCase()] || category || "Otros";
}

function mapStatus(status: string, quantity: number): "available" | "in-use" | "maintenance" {
  if (status === "maintenance" || status === "repair") return "maintenance";
  if (status === "in-use" || status === "borrowed" || quantity === 0) return "in-use";
  return "available";
}

function calculateEndTime(startTime: string, duration: string): string {
  const start = new Date(startTime);
  const durationMap: Record<string, number> = {
    "30min": 30,
    "1h": 60,
    "2h": 120,
    "4h": 240,
    "8h": 480,
    "1d": 1440,
    "2d": 2880,
    "1w": 10080,
  };
  const minutes = durationMap[duration] || 60;
  return new Date(start.getTime() + minutes * 60 * 1000).toISOString();
}

function getDefaultEquipment(usageMap: Map<string, any>): Equipment[] {
  const defaults = [
    { id: "eq-1", name: "Impresora 3D Ender 3 Pro", category: "Impresión 3D", status: "available" as const, quantity: 3, location: "Sala Principal" },
    { id: "eq-2", name: "Arduino Uno R3", category: "Electrónica", status: "available" as const, quantity: 15, location: "Estante A1" },
    { id: "eq-3", name: "Raspberry Pi 4", category: "Computación", status: "available" as const, quantity: 5, location: "Laboratorio" },
    { id: "eq-4", name: "Multímetro Digital", category: "Herramientas", status: "available" as const, quantity: 8, location: "Caja de Herramientas" },
    { id: "eq-5", name: "Soldador de Estaño", category: "Herramientas", status: "available" as const, quantity: 6, location: "Mesa de Trabajo" },
    { id: "eq-6", name: "Osciloscopio Digital", category: "Electrónica", status: "available" as const, quantity: 2, location: "Laboratorio" },
    { id: "eq-7", name: "Cortadora Láser", category: "Herramientas", status: "available" as const, quantity: 1, location: "Área de Corte" },
    { id: "eq-8", name: "ESP32 DevKit", category: "Electrónica", status: "available" as const, quantity: 20, location: "Estante A2" },
    { id: "eq-9", name: "Sensor Ultrasónico HC-SR04", category: "Electrónica", status: "available" as const, quantity: 25, location: "Cajón de Sensores" },
    { id: "eq-10", name: "Monitor 24\" Dell", category: "Computación", status: "available" as const, quantity: 4, location: "Estaciones de Trabajo" },
  ];

  console.log("[EquipmentUsage] getDefaultEquipment - usageMap keys:", Array.from(usageMap.keys()));

  // Aplicar usos activos y estados de mantenimiento a los equipos por defecto
  return defaults.map(equip => {
    // Primero verificar si está en mantenimiento
    const isInMaintenance = maintenanceStatus.get(equip.id);
    if (isInMaintenance) {
      return {
        ...equip,
        status: "maintenance" as const,
      };
    }

    // Luego verificar si está en uso
    const activeUsage = usageMap.get(equip.id);
    console.log("[EquipmentUsage] Checking equip", equip.id, "- found in usageMap:", !!activeUsage);
    if (activeUsage) {
      return {
        ...equip,
        status: "in-use" as const,
        currentUserId: activeUsage.userId,
        currentUserName: activeUsage.userName,
        estimatedEndTime: calculateEndTime(activeUsage.startTime, activeUsage.estimatedDuration),
      };
    }
    return equip;
  });
}
