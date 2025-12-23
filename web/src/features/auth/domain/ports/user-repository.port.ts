/**
 * Puerto (interfaz) para el repositorio de usuarios
 * Define el contrato que deben implementar los adaptadores
 */

import type { User } from '../entities/user';
import type { RoleCode } from '../entities/role';
import type { UserModuleAccess } from '../value-objects/permission';

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    roleCode?: RoleCode;
    moduleAccess?: UserModuleAccess;
}

export interface UpdateUserInput {
    username?: string;
    email?: string;
    password?: string;
    roleCode?: RoleCode;
    moduleAccess?: UserModuleAccess;
    isActive?: boolean;
}

export interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
    update(id: string, input: UpdateUserInput): Promise<User>;
    delete(id: string): Promise<void>;
}
