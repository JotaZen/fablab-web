/**
 * InventoryClient - Cliente para consultar el sistema de inventario REST
 *
 * Este cliente maneja las consultas al API REST del inventario.
 * Asume un endpoint base configurable.
 */
export class InventoryClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Obtiene todos los movimientos de inventario
   */
  async getMovimientos(): Promise<MovimientoInventario[]> {
    const res = await fetch(`${this.baseUrl}/movimientos`);
    if (!res.ok) throw new Error("Error al obtener movimientos");
    return (await res.json()) as MovimientoInventario[];
  }

  /**
   * Obtiene un movimiento por ID
   */
  async getMovimiento(id: string): Promise<MovimientoInventario> {
    const res = await fetch(`${this.baseUrl}/movimientos/${id}`);
    if (!res.ok) throw new Error("Error al obtener movimiento");
    return (await res.json()) as MovimientoInventario;
  }

  /**
   * Obtiene todas las locaciones
   */
  async getLocations(): Promise<Location[]> {
    const res = await fetch(`${this.baseUrl}/v1/locations/read`);
    if (!res.ok) throw new Error("Error al obtener locaciones");
    return (await res.json()) as Location[];
  }

  /**
   * Obtiene una locación por ID
   */
  async getLocation(id: string): Promise<Location> {
    const res = await fetch(`${this.baseUrl}/v1/locations/show/${id}`);
    if (!res.ok) throw new Error("Error al obtener locación");
    return (await res.json()) as Location;
  }

  /**
   * Crea una nueva locación
   */
  async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
    const res = await fetch(`${this.baseUrl}/v1/locations/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    if (!res.ok) throw new Error("Error al crear locación");
    return (await res.json()) as Location;
  }

  /**
   * Actualiza una locación
   */
  async updateLocation(id: string, location: Partial<Location>): Promise<Location> {
    const res = await fetch(`${this.baseUrl}/v1/locations/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    if (!res.ok) throw new Error("Error al actualizar locación");
    return (await res.json()) as Location;
  }

  /**
   * Elimina una locación
   */
  async deleteLocation(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/v1/locations/delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar locación");
  }
}

// Tipos
export interface MovimientoInventario {
  id: string;
  productoId: string;
  cantidad: number;
  tipoMovimiento: "entrada" | "salida";
  fecha: Date;
  usuarioId: string;
  descripcion?: string;
}

export interface Location {
  id: string;
  name: string;
  address_id: string;
  type: 'warehouse' | 'store' | 'office' | 'distribution_center';
  description?: string;
}