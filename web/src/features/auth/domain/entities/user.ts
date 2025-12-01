/**
 * User - Entidad de usuario
 */
import type { Role } from './role';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}
