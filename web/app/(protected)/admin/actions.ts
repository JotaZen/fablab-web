"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { promises as fs } from "fs";
import path from "path";

// ============================================================
// TIPOS
// ============================================================

export interface DashboardMetrics {
  // Especialistas
  totalSpecialists: number;
  activeSpecialists: number;
  teamImprovement: number; // porcentaje

  // Proyectos
  activeProjects: number;
  projectsTrend: number; // porcentaje vs mes anterior

  // Inventario (se obtiene desde Vessel API)
  totalEquipment: number;
  equipmentInUse: number;
  lowStockItems: number;
  totalStock: number; // cantidad total de unidades en stock

  // Almacenamiento
  storageUsed: number; // bytes
  storageTotal: number; // bytes
  storageFiles: number; // cantidad de archivos
}

export interface StorageInfo {
  used: number;
  total: number;
  files: number;
  available: number;
  usagePercent: number;
}

// ============================================================
// ESPECIALISTAS
// ============================================================

export async function getSpecialistsMetrics() {
  try {
    const payload = await getPayload({ config });

    // Obtener total de usuarios
    const { totalDocs: totalUsers } = await payload.find({
      collection: "users",
      limit: 1,
    });

    // Obtener usuarios visibles en equipo (showInTeam = true)
    const { totalDocs: activeCount } = await payload.find({
      collection: "users",
      where: {
        showInTeam: {
          equals: true,
        },
      },
      limit: 1,
    });

    // Calcular mejora del equipo
    const improvement = activeCount > 5 ? 15 : activeCount > 2 ? 8 : 0;

    return {
      total: totalUsers,
      active: activeCount,
      improvement: Math.max(0, improvement),
    };
  } catch (error) {
    console.error("[DashboardMetrics] Error obteniendo especialistas:", error);
    return {
      total: 0,
      active: 0,
      improvement: 0,
    };
  }
}

export async function getActiveSpecialists() {
  try {
    const payload = await getPayload({ config });

    // Obtener usuarios con showInTeam = true de la colección users
    const { docs } = await payload.find({
      collection: "users",
      where: {
        showInTeam: {
          equals: true,
        },
      },
      limit: 100,
      depth: 1,
      sort: 'order',
    });

    return docs.map((doc: any) => {
      return {
        id: doc.id,
        name: doc.name || 'Sin nombre',
        email: doc.email,
        role: doc.jobTitle || '',
        category: doc.category || 'specialist',
        specialty: doc.jobTitle || '',
        image: typeof doc.avatar === "object" ? doc.avatar?.url : null,
        active: true,
      };
    });
  } catch (error) {
    console.error("[DashboardMetrics] Error obteniendo especialistas activos:", error);
    return [];
  }
}

// ============================================================
// PROYECTOS
// ============================================================

export async function getProjectsMetrics() {
  try {
    const payload = await getPayload({ config });

    // El campo status usa 'draft' y 'published', no 'active'
    // Consideramos 'published' como proyectos activos
    const { totalDocs: activeProjects } = await payload.find({
      collection: "projects",
      where: {
        status: {
          equals: "published",
        },
      },
      limit: 1,
    });

    // TODO: Calcular tendencia comparando con mes anterior
    // Por ahora usamos un valor basado en la cantidad de proyectos
    const trend = activeProjects > 10 ? 12 : activeProjects > 5 ? 8 : 5;

    return {
      active: activeProjects,
      trend,
    };
  } catch (error) {
    // Si la colección no existe, devolver 0
    console.error("[DashboardMetrics] Error obteniendo proyectos:", error);
    return {
      active: 0,
      trend: 0,
    };
  }
}

export async function getActiveProjects() {
  try {
    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "projects",
      where: {
        status: {
          equals: "published",
        },
      },
      limit: 10,
      depth: 1,
    });

    return docs.map((doc) => {
      const project = doc as { id: string; title?: string; status?: string; description?: string; createdAt?: string };
      return {
        id: project.id,
        title: project.title,
        status: project.status,
        description: project.description,
        createdAt: project.createdAt,
      };
    });
  } catch (error) {
    console.error("[DashboardMetrics] Error obteniendo proyectos activos:", error);
    return [];
  }
}

// ============================================================
// ALMACENAMIENTO
// ============================================================

export async function getStorageMetrics(): Promise<StorageInfo> {
  try {
    // Directorio de medios (donde Payload guarda los archivos)
    const mediaDir = path.join(process.cwd(), "media");

    let totalSize = 0;
    let fileCount = 0;

    // Calcular tamaño total de archivos en el directorio media
    try {
      const files = await getFilesRecursively(mediaDir);
      for (const file of files) {
        try {
          const stats = await fs.stat(file);
          totalSize += stats.size;
          fileCount++;
        } catch {
          // Ignorar archivos que no se pueden leer
        }
      }
    } catch {
      // Si el directorio no existe, comenzar con 0
    }

    // Límite de almacenamiento configurable (default 500MB)
    const storageLimit =
      parseInt(process.env.STORAGE_LIMIT_MB || "500", 10) * 1024 * 1024;

    const available = Math.max(0, storageLimit - totalSize);
    const usagePercent = storageLimit > 0 ? (totalSize / storageLimit) * 100 : 0;

    return {
      used: totalSize,
      total: storageLimit,
      files: fileCount,
      available,
      usagePercent: Math.round(usagePercent * 10) / 10,
    };
  } catch (error) {
    console.error("[DashboardMetrics] Error obteniendo almacenamiento:", error);
    return {
      used: 0,
      total: 500 * 1024 * 1024, // 500MB default
      files: 0,
      available: 500 * 1024 * 1024,
      usagePercent: 0,
    };
  }
}

async function getFilesRecursively(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await getFilesRecursively(fullPath)));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  } catch {
    // Ignorar errores de lectura
  }

  return files;
}

// ============================================================
// INVENTARIO (desde Vessel API)
// ============================================================

export async function getInventoryMetrics() {
  try {
    // Usar variable de entorno del servidor (no NEXT_PUBLIC_*)
    const baseUrl = process.env.VESSEL_API_URL || process.env.NEXT_PUBLIC_VESSEL_API_URL;
    
    // Validar que la URL esté configurada
    if (!baseUrl || baseUrl === 'undefined' || baseUrl === 'null') {
      console.warn("[DashboardMetrics] VESSEL_API_URL no configurada, retornando valores por defecto");
      return {
        total: 0,
        active: 0,
        lowStock: 0,
        totalStock: 0,
      };
    }

    // Validar token de acceso
    const accessToken = process.env.VESSEL_ACCESS_PRIVATE;
    if (!accessToken) {
      console.warn("[DashboardMetrics] VESSEL_ACCESS_PRIVATE no configurado");
    }

    // Timeout para evitar bloqueos largos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const itemsResponse = await fetch(`${baseUrl}/api/v1/items/read`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { "VESSEL-ACCESS-PRIVATE": accessToken }),
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!itemsResponse.ok) {
        console.warn(`[DashboardMetrics] Vessel API respondió con ${itemsResponse.status}`);
        return {
          total: 0,
          active: 0,
          lowStock: 0,
        };
      }

      const itemsData = await itemsResponse.json();
      const items: { status?: string }[] = Array.isArray(itemsData) ? itemsData : itemsData.data || [];
      
      // Contar items activos y en uso
      const totalEquipment = items.length;
      const activeItems = items.filter((item) => item.status === "active");
      
      // Obtener stock para determinar items bajo stock y total de stock
      let lowStockItems = 0;
      let totalStock = 0;
      let totalStockItems = 0;
      try {
        const stockController = new AbortController();
        const stockTimeoutId = setTimeout(() => stockController.abort(), 5000);
        
        // Obtener todos los stock items (hacer paginación)
        let allStocks: { available_quantity?: number; quantity?: number; reserved_quantity?: number }[] = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= 10) { // Máximo 10 páginas para evitar loops infinitos
          const stockResponse = await fetch(`${baseUrl}/api/v1/stock/items/read?per_page=100&page=${page}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(accessToken && { "VESSEL-ACCESS-PRIVATE": accessToken }),
            },
            cache: "no-store",
            signal: stockController.signal,
          });

          if (!stockResponse.ok) break;
          
          const stockData = await stockResponse.json();
          const stocks = Array.isArray(stockData) ? stockData : stockData.data || [];
          allStocks = allStocks.concat(stocks);
          
          const lastPage = stockData.last_page || 1;
          hasMore = page < lastPage;
          page++;
        }

        clearTimeout(stockTimeoutId);

        totalStockItems = allStocks.length;
        
        // Calcular total de stock y items bajo stock
        for (const s of allStocks) {
          const qty = s.quantity || 0;
          totalStock += qty;
          
          const available = s.available_quantity ?? (qty - (s.reserved_quantity || 0));
          if (available < 5) {
            lowStockItems++;
          }
        }
      } catch (stockErr) {
        // Ignorar errores de stock silenciosamente
        console.debug("[DashboardMetrics] No se pudo obtener stock:", stockErr);
      }

      return {
        total: totalStockItems > 0 ? totalStockItems : totalEquipment,
        active: activeItems.length,
        lowStock: lowStockItems,
        totalStock: totalStock,
      };
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      
      // Manejar timeout y errores de red
      if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
        console.warn("[DashboardMetrics] Timeout al conectar con Vessel API");
      } else {
        console.warn("[DashboardMetrics] Error conectando con Vessel API:", fetchErr);
      }
      
      return {
        total: 0,
        active: 0,
        lowStock: 0,
        totalStock: 0,
      };
    }
  } catch (error) {
    console.error("[DashboardMetrics] Error inesperado en inventario:", error);
    return {
      total: 0,
      active: 0,
      lowStock: 0,
      totalStock: 0,
    };
  }
}

// ============================================================
// MÉTRICAS COMPLETAS DEL DASHBOARD
// ============================================================

// Valores por defecto para métricas fallidas
const DEFAULT_SPECIALISTS = { total: 0, active: 0, improvement: 0 };
const DEFAULT_PROJECTS = { active: 0, trend: 0 };
const DEFAULT_STORAGE = { used: 0, total: 500 * 1024 * 1024, files: 0, available: 500 * 1024 * 1024, usagePercent: 0 };
const DEFAULT_INVENTORY = { total: 0, active: 0, lowStock: 0, totalStock: 0 };

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Ejecutar todas las consultas en paralelo, cada una con manejo de errores independiente
  const [specialists, projects, storage, inventory] = await Promise.all([
    getSpecialistsMetrics().catch((err) => {
      console.error("[Dashboard] Error en métricas de especialistas:", err);
      return DEFAULT_SPECIALISTS;
    }),
    getProjectsMetrics().catch((err) => {
      console.error("[Dashboard] Error en métricas de proyectos:", err);
      return DEFAULT_PROJECTS;
    }),
    getStorageMetrics().catch((err) => {
      console.error("[Dashboard] Error en métricas de almacenamiento:", err);
      return DEFAULT_STORAGE;
    }),
    getInventoryMetrics().catch((err) => {
      console.error("[Dashboard] Error en métricas de inventario:", err);
      return DEFAULT_INVENTORY;
    }),
  ]);

  return {
    // Especialistas
    totalSpecialists: specialists.total,
    activeSpecialists: specialists.active,
    teamImprovement: specialists.improvement,

    // Proyectos
    activeProjects: projects.active,
    projectsTrend: projects.trend,

    // Inventario
    totalEquipment: inventory.total,
    equipmentInUse: inventory.active,
    lowStockItems: inventory.lowStock,
    totalStock: inventory.totalStock,

    // Almacenamiento
    storageUsed: storage.used,
    storageTotal: storage.total,
    storageFiles: storage.files,
  };
}
