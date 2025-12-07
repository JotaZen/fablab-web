/**
 * User - Entidad de usuario
 */
import type { Role, RoleCode } from './role';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

export interface UserInput {
  email: string;
  password?: string;
  name: string;
  roleCode?: RoleCode;
  isActive?: boolean;
}
