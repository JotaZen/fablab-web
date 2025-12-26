import { describe, it, expect } from 'vitest';
import {
    parsePermission,
    hasPermission,
    hasModuleAccess,
    createPermission,
    WILDCARD_PERMISSION,
    FeatureModule,
    UserModuleAccess,
    Permission
} from '../permission';

describe('Permission System', () => {
    describe('parsePermission', () => {
        it('should correctly parse a valid permission string', () => {
            const perm = 'inventory.items.read:all';
            const parsed = parsePermission(perm);

            expect(parsed).toEqual({
                module: 'inventory',
                resource: 'items',
                operation: 'read',
                scope: 'all',
                isWildcard: false,
            });
        });

        it('should return null for invalid permission string format', () => {
            expect(parsePermission('invalid.string')).toBeNull();
            expect(parsePermission('inventory.items.read')).toBeNull(); // Missing scope
        });

        it('should return null for invalid parts', () => {
            expect(parsePermission('mod.res.op:invalidScope')).toBeNull();
            expect(parsePermission('mod.res.invalidOp:all')).toBeNull();
        });

        it('should correctly parse the wildcard permission', () => {
            const parsed = parsePermission(WILDCARD_PERMISSION);
            expect(parsed).toEqual({
                module: '*',
                resource: '*',
                operation: 'manage',
                scope: 'all',
                isWildcard: true,
            });
        });
    });

    describe('hasPermission', () => {
        const userPermissions: Permission[] = [
            'inventory.items.read:all',
            'blog.posts.update:own',
            'users.users.manage:workspace'
        ];

        it('should return true when user has exact permission', () => {
            expect(hasPermission(userPermissions, 'inventory.items.read:all')).toBe(true);
        });

        it('should return false when user does not have permission', () => {
            expect(hasPermission(userPermissions, 'inventory.items.delete:all')).toBe(false);
        });

        it('should handle scope hierarchy correctly', () => {
            // User has 'read:all', should verify for 'read:own'
            expect(hasPermission(userPermissions, 'inventory.items.read:own')).toBe(true);

            // User has 'update:own', should fail for 'update:all'
            expect(hasPermission(userPermissions, 'blog.posts.update:all')).toBe(false);
        });

        it('should return true if user has wildcard permission', () => {
            expect(hasPermission([WILDCARD_PERMISSION], 'any.thing.manage:all')).toBe(true);
        });

        it('should return true if user has manage operation for a resource', () => {
            // User has 'users.users.manage:workspace', should allow 'users.users.read:workspace'
            expect(hasPermission(userPermissions, 'users.users.read:workspace')).toBe(true);
        });
    });

    describe('hasModuleAccess', () => {
        const userAccess: UserModuleAccess = {
            inventory: 'view',
            blog: 'edit_own',
            users: 'manage',
            cms: 'none',
            settings: 'none',
        };

        it('should return true for "view" required level if user has "view" or higher', () => {
            expect(hasModuleAccess(userAccess, 'inventory', 'view')).toBe(true);
            expect(hasModuleAccess(userAccess, 'blog', 'view')).toBe(true);
            expect(hasModuleAccess(userAccess, 'users', 'view')).toBe(true);
        });

        it('should return false if user has "none"', () => {
            expect(hasModuleAccess(userAccess, 'cms', 'view')).toBe(false);
        });

        it('should return true for higher access requirements if user meets them', () => {
            expect(hasModuleAccess(userAccess, 'blog', 'edit_own')).toBe(true);
            expect(hasModuleAccess(userAccess, 'users', 'manage')).toBe(true);
        });

        it('should return false for higher access requirements if user does not meet them', () => {
            expect(hasModuleAccess(userAccess, 'inventory', 'manage')).toBe(false);
            expect(hasModuleAccess(userAccess, 'inventory', 'edit_all')).toBe(false);
        });
    });
});
