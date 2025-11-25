"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Post, PostsPaginados, FiltrosPosts, PostInput } from '../../domain/entities';
import { BlogClient } from '../../infrastructure/api/blog-client';

// Utilidad para obtener cookie en cliente
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

interface UseBlogState {
  posts: Post[];
  postActual: Post | null;
  total: number;
  pagina: number;
  totalPaginas: number;
  cargando: boolean;
  error: string | null;
}

interface UseBlogActions {
  cargarPosts: (filtros?: FiltrosPosts) => Promise<void>;
  cargarPost: (idOrSlug: string) => Promise<void>;
  cargarPostsRecientes: (limite?: number) => Promise<Post[]>;
  cargarPostsPopulares: (limite?: number) => Promise<Post[]>;
  crearPost: (input: PostInput) => Promise<Post>;
  actualizarPost: (id: string, input: Partial<PostInput>) => Promise<void>;
  publicarPost: (id: string) => Promise<void>;
  despublicarPost: (id: string) => Promise<void>;
  eliminarPost: (id: string) => Promise<void>;
  limpiarError: () => void;
}

export type UseBlogResult = UseBlogState & UseBlogActions;

export function useBlog(): UseBlogResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postActual, setPostActual] = useState<Post | null>(null);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => {
    const token = getCookie('fablab_jwt'); // Cookie accesible desde JS
    return new BlogClient({
      baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      token,
    });
  }, []);

  const cargarPosts = useCallback(async (filtros?: FiltrosPosts) => {
    setCargando(true);
    setError(null);
    try {
      const result = await client.getPosts(filtros);
      setPosts(result.posts);
      setTotal(result.total);
      setPagina(result.pagina);
      setTotalPaginas(result.totalPaginas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar posts');
    } finally {
      setCargando(false);
    }
  }, [client]);

  const cargarPost = useCallback(async (idOrSlug: string) => {
    setCargando(true);
    setError(null);
    try {
      const post = await client.getPost(idOrSlug);
      setPostActual(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar post');
    } finally {
      setCargando(false);
    }
  }, [client]);

  const cargarPostsRecientes = useCallback(async (limite = 5): Promise<Post[]> => {
    try {
      return await client.getPostsRecientes(limite);
    } catch (err) {
      console.error('Error cargando posts recientes:', err);
      return [];
    }
  }, [client]);

  const cargarPostsPopulares = useCallback(async (limite = 5): Promise<Post[]> => {
    try {
      return await client.getPostsPopulares(limite);
    } catch (err) {
      console.error('Error cargando posts populares:', err);
      return [];
    }
  }, [client]);

  const crearPost = useCallback(async (input: PostInput): Promise<Post> => {
    setCargando(true);
    setError(null);
    try {
      const nuevo = await client.createPost(input);
      setPosts(prev => [nuevo, ...prev]);
      return nuevo;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear post';
      setError(msg);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const actualizarPost = useCallback(async (id: string, input: Partial<PostInput>) => {
    setCargando(true);
    setError(null);
    try {
      const actualizado = await client.updatePost(id, input);
      setPosts(prev => prev.map(p => p.id === id ? actualizado : p));
      if (postActual?.id === id) {
        setPostActual(actualizado);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar post');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client, postActual]);

  const publicarPost = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      const actualizado = await client.publishPost(id);
      setPosts(prev => prev.map(p => p.id === id ? actualizado : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar post');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const despublicarPost = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      const actualizado = await client.unpublishPost(id);
      setPosts(prev => prev.map(p => p.id === id ? actualizado : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al despublicar post');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const eliminarPost = useCallback(async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      await client.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar post');
      throw err;
    } finally {
      setCargando(false);
    }
  }, [client]);

  const limpiarError = useCallback(() => setError(null), []);

  return {
    posts,
    postActual,
    total,
    pagina,
    totalPaginas,
    cargando,
    error,
    cargarPosts,
    cargarPost,
    cargarPostsRecientes,
    cargarPostsPopulares,
    crearPost,
    actualizarPost,
    publicarPost,
    despublicarPost,
    eliminarPost,
    limpiarError,
  };
}
