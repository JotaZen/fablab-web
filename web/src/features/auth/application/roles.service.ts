/**
 * Auth Application - Roles Service
 * 
 * Casos de uso de gestión de roles y permisos.
 */

import type { Role } from '../domain/entities/role';
import type { Permission } from '../domain/value-objects/permission';

// Interfaz para el adaptador de roles
export interface RolesAdapter {
  list(): Promise<Role[]>;
  getById(id: string | number): Promise<Role | null>;
  create(data: Omit<Role, 'id'>): Promise<Role>;
  update(id: string | number, data: Partial<Omit<Role, 'id'>>): Promise<Role>;
  delete(id: string | number): Promise<void>;
  getPermissions(): Promise<Permission[]>;
}

let rolesAdapter: RolesAdapter | null = null;

export function setRolesAdapter(adapter: RolesAdapter): void {
  rolesAdapter = adapter;
}

function getAdapter(): RolesAdapter {
  if (!rolesAdapter) {
    throw new Error('RolesAdapter no configurado. Llama a setRolesAdapter() primero.');
  }
  return rolesAdapter;
}

// ============================================================
// USE CASES
// ============================================================

/** Listar todos los roles */
export async function listRoles(): Promise<Role[]> {
  return getAdapter().list();
}

/** Obtener rol por ID */
export async function getRole(id: string | number): Promise<Role | null> {
  return getAdapter().getById(id);
}

/** Crear rol */
export async function createRole(data: Omit<Role, 'id'>): Promise<Role> {
  return getAdapter().create(data);
}

/** Actualizar rol */
export async function updateRole(id: string | number, data: Partial<Omit<Role, 'id'>>): Promise<Role> {
  return getAdapter().update(id, data);
}

/** Eliminar rol */
export async function deleteRole(id: string | number): Promise<void> {
  return getAdapter().delete(id);
}

/** Listar todos los permisos disponibles */
export async function listPermissions(): Promise<Permission[]> {
  return getAdapter().getPermissions();
}
