"use client";

import { useEffect, useState } from 'react';
import { useBlog } from '../hooks/use-blog';
import { PostsList } from '../components/posts/posts-list';
import { PostEditor } from '../components/posts/post-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { FileText, Eye, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/buttons/button';
import type { Post, EstadoPost, PostInput } from '../../domain/entities';

type Vista = 'lista' | 'editor';

export function BlogDashboard() {
  const {
    posts,
    total,
    cargando,
    error,
    cargarPosts,
    crearPost,
    actualizarPost,
    publicarPost,
    despublicarPost,
    eliminarPost,
    limpiarError,
  } = useBlog();

  const [vista, setVista] = useState<Vista>('lista');
  const [postEditando, setPostEditando] = useState<Post | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPost | undefined>();
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarPosts({ estado: estadoFiltro, busqueda: busqueda || undefined });
  }, [cargarPosts, estadoFiltro, busqueda]);

  const handleNuevo = () => {
    setPostEditando(null);
    setVista('editor');
  };

  const handleEditar = (post: Post) => {
    setPostEditando(post);
    setVista('editor');
  };

  const handleVolver = () => {
    setVista('lista');
    setPostEditando(null);
  };

  const handleGuardar = async (data: PostInput) => {
    if (postEditando) {
      await actualizarPost(postEditando.id, data);
    } else {
      await crearPost(data);
    }
    handleVolver();
  };

  const handlePublicar = async (data: PostInput) => {
    const post = await crearPost({ ...data, estado: 'publicado' });
    await publicarPost(post.id);
    handleVolver();
  };

  // Stats
  const publicados = posts.filter(p => p.estado === 'publicado').length;
  const borradores = posts.filter(p => p.estado === 'borrador').length;
  const totalVistas = posts.reduce((sum, p) => sum + (p.vistas || 0), 0);

  if (vista === 'editor') {
    return (
      <PostEditor
        initialData={postEditando ? {
          titulo: postEditando.titulo,
          contenido: postEditando.contenido,
          extracto: postEditando.extracto,
          etiquetas: postEditando.etiquetas,
        } : undefined}
        onGuardar={handleGuardar}
        onPublicar={!postEditando ? handlePublicar : undefined}
        onVolver={handleVolver}
        cargando={cargando}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">
          Gestiona los posts del blog del FabLab
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={limpiarError}>
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borradores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVistas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Posts */}
      <PostsList
        posts={posts}
        cargando={cargando}
        onNuevo={handleNuevo}
        onEditar={handleEditar}
        onEliminar={eliminarPost}
        onPublicar={publicarPost}
        onDespublicar={despublicarPost}
        onBuscar={setBusqueda}
        onFiltrarEstado={setEstadoFiltro}
        estadoFiltro={estadoFiltro}
      />
    </div>
  );
}
