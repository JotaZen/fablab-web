/**
 * Types - Equipo Page
 */

import type { LucideIcon } from "lucide-react";

export interface TeamMember {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  imagen: string;
  bio: string;
  experiencia: string;
  logros: string[];
  social: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email: string;
  };
  esDirectivo: boolean;
}

export interface MiembroDestacado {
  id: string;
  nombre: string;
  imagen: string;
  especialidad: string;
  proyectoDestacado: string;
  testimonio: string;
  miembroDesde: string;
}

export interface ValorLab {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface BeneficioMembresia {
  titulo: string;
  descripcion: string;
  icono: string;
}
