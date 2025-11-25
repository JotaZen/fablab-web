"use client";

import { useState, useCallback, useMemo } from 'react';
import type { Usuario, UsuarioInput, FiltrosUsuarios } from '../../domain/users';
import { getUsersClient } from '../../infrastructure/users-client';

// Utilidad para obtener cookie
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

interface UseUsersState {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  total: number;
  pagina: number;
  totalPaginas: number;
  cargando: boolean;
  error: string | null;
}

interface UseUsersActions {
  cargarUsuarios: (filtros?: FiltrosUsuarios) => Promise<void>;
  cargarUsuario: (id: string | number) => Promise<void>;
  crearUsuario: (input: UsuarioInput) => Promise<Usuario>;
  actualizarUsuario: (id: string | number, input: Partial<UsuarioInput>) => Promise<void>;
  eliminarUsuario: (id: string | number) => Promise<void>;
  bloquearUsuario: (id: string | number, bloqueado: boolean) => Promise<void>;
  cambiarRoles: (id: string | number, roles: string[]) => Promise<void>;
  limpiarError: () => void;
  limpiarUsuarioActual: () => void;
}

export type UseUsersResult = UseUsersState & UseUsersActions;

export function useUsers(): UseUsersResult {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(() => {
    const token = getCookie('fablab_jwt');
    if (!token) {
      throw new Error('No hay sesión activa');
    }
    return getUsersClient(token);
  }, []);

  const cargarUsuarios = useCallback(async (filtros?: FiltrosUsuarios) => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      const result = await client.getUsers(filtros);
      setUsuarios(result.usuarios);
      setTotal(result.total);
      setPagina(result.pagina);
      setTotalPaginas(result.totalPaginas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  }, [getClient]);

  const cargarUsuario = useCallback(async (id: string | number) => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      const usuario = await client.getUser(id);
      setUsuarioActual(usuario);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuario');
    } finally {
      setCargando(false);
    }
  }, [getClient]);

  const crearUsuario = useCallback(async (input: UsuarioInput): Promise<Usuario> => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      const usuario = await client.createUser(input);
      setUsuarios(prev => [usuario, ...prev]);
      setTotal(prev => prev + 1);
      return usuario;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(message);
      throw new Error(message);
    } finally {
      setCargando(false);
    }
  }, [getClient]);

  const actualizarUsuario = useCallback(async (id: string | number, input: Partial<UsuarioInput>) => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      const usuario = await client.updateUser(id, input);
      setUsuarios(prev => prev.map(u => u.id === id ? usuario : u));
      if (usuarioActual?.id === id) {
        setUsuarioActual(usuario);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [getClient, usuarioActual]);

  const eliminarUsuario = useCallback(async (id: string | number) => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      await client.deleteUser(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      setTotal(prev => prev - 1);
      if (usuarioActual?.id === id) {
        setUsuarioActual(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [getClient, usuarioActual]);

  const bloquearUsuario = useCallback(async (id: string | number, bloqueado: boolean) => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      const usuario = await client.toggleBlock(id, bloqueado);
      setUsuarios(prev => prev.map(u => u.id === id ? usuario : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado del usuario');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [getClient]);

  const cambiarRoles = useCallback(async (id: string | number, roles: string[]) => {
    setCargando(true);
    setError(null);
    try {
      const client = getClient();
      const usuario = await client.updateRoles(id, roles);
      setUsuarios(prev => prev.map(u => u.id === id ? usuario : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar roles');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [getClient]);

  const limpiarError = useCallback(() => setError(null), []);
  const limpiarUsuarioActual = useCallback(() => setUsuarioActual(null), []);

  return {
    usuarios,
    usuarioActual,
    total,
    pagina,
    totalPaginas,
    cargando,
    error,
    cargarUsuarios,
    cargarUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    bloquearUsuario,
    cambiarRoles,
    limpiarError,
    limpiarUsuarioActual,
  };
}
