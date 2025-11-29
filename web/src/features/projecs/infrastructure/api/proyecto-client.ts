/**
 * Cliente para el API de Proyectos en Strapi
 */

import type { Project } from "@/features/projecs/domain";
import type { StrapiProyectoResponse } from "./types";
import { strapiToProject } from "./adapters";

export interface ProyectoClientConfig {
  baseUrl: string;
  token?: string;
}

export class ProyectoClient {
  private baseUrl: string;
  private token?: string;

  constructor(config: ProyectoClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.token = config.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: { message: "Error desconocido" } }));
      throw new Error(error.error?.message || `Error ${res.status}`);
    }
    return res.json();
  }

  /**
   * Obtiene el proyecto (single type)
   * Strapi single types se acceden directamente sin ID
   */
  async getProyecto(): Promise<Project> {
    const params = new URLSearchParams();
    params.set("populate[secciones][populate]", "*");
    
    const url = `${this.baseUrl}/api/proyecto?${params}`;
    
    const res = await fetch(url, {
      headers: this.getHeaders(),
      next: { revalidate: 60 }, // Revalidar cada 60 segundos
    });
    
    const data = await this.handleResponse<StrapiProyectoResponse>(res);
    return strapiToProject(data.data);
  }
}

// Singleton
let clientInstance: ProyectoClient | null = null;

export function getProyectoClient(config?: ProyectoClientConfig): ProyectoClient {
  if (!clientInstance && config) {
    clientInstance = new ProyectoClient(config);
  }
  if (!clientInstance) {
    clientInstance = new ProyectoClient({
      baseUrl: process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
    });
  }
  return clientInstance;
}

// Instancia pre-configurada
export const proyectoClient = getProyectoClient();
