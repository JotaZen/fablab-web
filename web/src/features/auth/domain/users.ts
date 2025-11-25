/**
 * Entidades del dominio de Usuarios
 */

import type { Permission } from './permissions';

// ==================== USUARIO ====================

export interface Usuario {
  id: string | number;
  username: string;
  email: string;
  nombre?: string;
  apellido?: string;
  avatar?: string;
  roles: string[];           // IDs de roles (admin, editor, etc.)
  permisos: Permission[];    // Permisos calculados de sus roles
  bloqueado: boolean;
  confirmado: boolean;
  proveedor: 'local' | 'google' | 'github';
  fechaCreacion: Date;
  fechaActualizacion: Date;
  ultimoAcceso?: Date;
}

export interface UsuarioInput {
  username: string;
  email: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  roles: string[];
  bloqueado?: boolean;
}

export interface UsuarioRegistro {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
}

// ==================== FILTROS ====================

export interface FiltrosUsuarios {
  busqueda?: string;
  rol?: string;
  estado?: 'activo' | 'bloqueado' | 'todos';
  pagina?: number;
  porPagina?: number;
  ordenarPor?: 'username' | 'email' | 'fechaCreacion' | 'ultimoAcceso';
  orden?: 'asc' | 'desc';
}

export interface UsuariosPaginados {
  usuarios: Usuario[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// ==================== ROL PERSONALIZADO ====================

export interface RolPersonalizado {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
  usuariosCount: number;
  fechaCreacion: Date;
}

export interface RolInput {
  nombre: string;
  descripcion: string;
  permisos: Permission[];
}

// ==================== ACTIVIDAD ====================

export interface ActividadUsuario {
  id: string;
  usuarioId: string | number;
  accion: string;
  recurso: string;
  detalles?: Record<string, unknown>;
  ip?: string;
  fecha: Date;
}

// ==================== CONSTANTES ====================

export const USUARIOS_POR_PAGINA = 20;

export const ESTADOS_USUARIO = {
  ACTIVO: 'activo',
  BLOQUEADO: 'bloqueado',
} as const;

export type EstadoUsuario = typeof ESTADOS_USUARIO[keyof typeof ESTADOS_USUARIO];
