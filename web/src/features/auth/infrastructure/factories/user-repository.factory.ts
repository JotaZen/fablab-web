/**
 * Factory para obtener el repositorio de usuarios
 * Permite cambiar entre Payload, Strapi u otro backend
 */

import type { IUserRepository } from '../../domain/ports/user-repository.port';
import { getPayloadUserRepository } from '../payload/payload-user-repository';

export type UserRepositoryType = 'payload' | 'strapi' | 'mock';

const REPOSITORY_TYPE: UserRepositoryType =
    (process.env.USER_REPOSITORY_TYPE as UserRepositoryType) || 'payload';

export function getUserRepository(): IUserRepository {
    switch (REPOSITORY_TYPE) {
        case 'payload':
            return getPayloadUserRepository();

        case 'strapi':
            // TODO: Implementar StrapiUserRepository si se necesita
            throw new Error('Strapi repository not implemented yet');

        case 'mock':
            // TODO: Implementar MockUserRepository para testing
            throw new Error('Mock repository not implemented yet');

        default:
            return getPayloadUserRepository();
    }
}
