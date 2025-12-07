"use client";

import { useState, useCallback } from 'react';
import type { User, RoleCode } from '@/features/auth';

interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    roleCode?: RoleCode;
    sendConfirmationEmail?: boolean;
}

interface UpdateUserInput {
    username?: string;
    email?: string;
    password?: string;
    roleCode?: RoleCode;
    isActive?: boolean;
}

interface UseUsersState {
    users: User[];
    isLoading: boolean;
    error: string | null;
}

export function useUsers() {
    const [state, setState] = useState<UseUsersState>({
        users: [],
        isLoading: false,
        error: null,
    });

    const setLoading = (isLoading: boolean) => {
        setState(prev => ({ ...prev, isLoading, error: isLoading ? null : prev.error }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener usuarios');
            }

            setState(prev => ({ ...prev, users: data.users, isLoading: false }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const createUser = useCallback(async (input: CreateUserInput): Promise<User | null> => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear usuario');
            }

            setState(prev => ({
                ...prev,
                users: [...prev.users, data.user],
                isLoading: false,
            }));

            return data.user;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return null;
        }
    }, []);

    const updateUser = useCallback(async (id: string, input: UpdateUserInput): Promise<User | null> => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar usuario');
            }

            setState(prev => ({
                ...prev,
                users: prev.users.map(u => u.id === id ? data.user : u),
                isLoading: false,
            }));

            return data.user;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return null;
        }
    }, []);

    const deleteUser = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar usuario');
            }

            setState(prev => ({
                ...prev,
                users: prev.users.filter(u => u.id !== id),
                isLoading: false,
            }));

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return false;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        ...state,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        clearError,
    };
}
