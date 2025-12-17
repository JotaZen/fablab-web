/**
 * Adaptador Payload para el repositorio de usuarios
 * Implementa IUserRepository usando Payload CMS como backend
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { IUserRepository, CreateUserInput, UpdateUserInput } from '../../domain/ports/user-repository.port';
import type { User } from '../../domain/entities/user';
import { getRole } from '../../domain/entities/role';

export class PayloadUserRepository implements IUserRepository {

    private async getPayloadInstance() {
        return getPayload({ config: configPromise });
    }

    private mapPayloadUser(payloadUser: Record<string, unknown>): User {
        const roleCode = (payloadUser.role as string) || 'visitor';
        return {
            id: String(payloadUser.id),
            name: (payloadUser.name as string) || (payloadUser.email as string)?.split('@')[0] || 'Usuario',
            email: (payloadUser.email as string) || '',
            role: getRole(roleCode),
            isActive: true,
            createdAt: new Date(payloadUser.createdAt as string),
        };
    }

    async findAll(): Promise<User[]> {
        const payload = await this.getPayloadInstance();

        const result = await payload.find({
            collection: 'users',
            limit: 100,
        });

        return result.docs.map(doc => this.mapPayloadUser(doc as unknown as Record<string, unknown>));
    }

    async findById(id: string): Promise<User | null> {
        try {
            const payload = await this.getPayloadInstance();

            const user = await payload.findByID({
                collection: 'users',
                id,
            });

            return user ? this.mapPayloadUser(user as unknown as Record<string, unknown>) : null;
        } catch {
            return null;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const payload = await this.getPayloadInstance();

        const result = await payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
        });

        return result.docs.length > 0
            ? this.mapPayloadUser(result.docs[0] as unknown as Record<string, unknown>)
            : null;
    }

    async create(input: CreateUserInput): Promise<User> {
        const payload = await this.getPayloadInstance();

        const newUser = await payload.create({
            collection: 'users',
            data: {
                email: input.email,
                password: input.password,
                name: input.username,
                role: input.roleCode || 'visitor',
            },
        });

        return this.mapPayloadUser(newUser as unknown as Record<string, unknown>);
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        const payload = await this.getPayloadInstance();

        const updateData: Record<string, unknown> = {};
        if (input.username) updateData.name = input.username;
        if (input.email) updateData.email = input.email;
        if (input.password) updateData.password = input.password;
        if (input.roleCode) updateData.role = input.roleCode;

        const updatedUser = await payload.update({
            collection: 'users',
            id,
            data: updateData,
        });

        return this.mapPayloadUser(updatedUser as unknown as Record<string, unknown>);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.getPayloadInstance();

        await payload.delete({
            collection: 'users',
            id,
        });
    }
}

// Singleton instance
let instance: PayloadUserRepository | null = null;

export function getPayloadUserRepository(): IUserRepository {
    if (!instance) {
        instance = new PayloadUserRepository();
    }
    return instance;
}
