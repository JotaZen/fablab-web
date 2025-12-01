/**
 * User - Entidad de usuario
 */
import type { Role, RoleId } from './role';

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
  roleId?: RoleId;
  isActive?: boolean;
}
