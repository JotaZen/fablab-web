"use client";

import { useEffect, useState, useCallback } from 'react';
import { useBlog } from '../hooks/use-blog';
import { PostEditor } from '../components/posts/post-editor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Badge } from '@/shared/ui/badges/badge';
import { Input } from '@/shared/ui/inputs/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/shared/ui/tables/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/shared/ui/misc/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/shared/ui/misc/alert-dialog';
import {
  Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Send,
  FileText, ArrowLeft, Loader2, AlertCircle, ChevronLeft, ChevronRight,
  TrendingUp, Calendar, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import type { Post, EstadoPost, PostInput } from '../../domain/entities';

type Vista = 'lista' | 'editor';

function formatDate(date: string | Date | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function BlogDashboard() {
  const {
    posts,
    total,
    pagina,
    totalPaginas,
    cargando,
    error,
    filtros,
    cargarPosts,
    cambiarPagina,
    cambiarOrden,
    cargarPostsTendencia,
    crearPost,
    actualizarPost,
    publicarPost,
    despublicarPost,
    eliminarPost,
    limpiarError,
  } = useBlog();

  const [vista, setVista] = useState<Vista>('lista');
  const [postEditando, setPostEditando] = useState<Post | null>(null);
  const [postAEliminar, setPostAEliminar] = useState<Post | null>(null);

  // Estado local para inputs (search debounce)
  const [busquedaLocal, setBusquedaLocal] = useState('');
  const [tendenciaPost, setTendenciaPost] = useState<Post | null>(null);

  // Carga inicial y Tendencia
  useEffect(() => {
    cargarPosts();
    const loadTrends = async () => {
      const trends = await cargarPostsTendencia(1, 30);
      if (trends.length > 0) setTendenciaPost(trends[0]);
    };
    loadTrends();
  }, []); // Cargar solo al montar, filtros controla el resto

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busquedaLocal !== (filtros.busqueda || '')) {
        cargarPosts({ busqueda: busquedaLocal || undefined });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [busquedaLocal, cargarPosts, filtros.busqueda]);


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
    cargarPosts(); // Recargar lista al volver
  };

  const handleGuardar = async (data: PostInput) => {
    if (postEditando) {
      await actualizarPost(postEditando.id, data);
    } else {
      await crearPost(data);
    }
    handleVolver();
  };

  const handleEliminar = async () => {
    if (postAEliminar) {
      await eliminarPost(postAEliminar.id);
      setPostAEliminar(null);
    }
  };

  const toggleSort = (campo: 'fecha' | 'vistas' | 'titulo') => {
    const nuevoOrden = filtros.ordenarPor === campo && filtros.orden === 'desc' ? 'asc' : 'desc';
    cambiarOrden(campo, nuevoOrden);
  };

  const SortIcon = ({ campo }: { campo: 'fecha' | 'vistas' | 'titulo' }) => {
    if (filtros.ordenarPor !== campo) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return filtros.orden === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Stats
  const publicados = posts.filter(p => p.estado === 'publicado').length;
  // Note: Total counts should properly come from server if paginated, 
  // but for now relying on what's loaded or separate stats call if crucial.
  // Assuming 'total' from hook is the total count of filtered posts.

  // Vista Editor
  if (vista === 'editor') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleVolver}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-xl font-semibold">
            {postEditando ? 'Editar Post' : 'Nuevo Post'}
          </h1>
        </div>
        <PostEditor
          initialData={postEditando ? {
            titulo: postEditando.titulo,
            contenido: typeof postEditando.contenido === 'string' ? postEditando.contenido : '',
            extracto: postEditando.extracto,
            etiquetas: postEditando.etiquetas?.map(t => typeof t === 'string' ? t : '').filter(Boolean) as string[],
          } : undefined}
          onGuardar={handleGuardar}
          onVolver={handleVolver}
          cargando={cargando}
        />
      </div>
    );
  }

  // Vista Lista
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Gestiona los posts del blog
          </p>
        </div>
        <Button onClick={handleNuevo}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Post
        </Button>
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

      {/* Stats & Trends - Now 4 columns */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-sm text-muted-foreground">Total posts</p>
          </CardContent>
        </Card>

        {/* Tendencia Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              Top Mes (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tendenciaPost ? (
              <div className="space-y-1">
                <div className="text-md font-bold truncate" title={tendenciaPost.titulo}>
                  {tendenciaPost.titulo}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {tendenciaPost.vistas}
                  </span>
                  <span>•</span>
                  <span>{formatDate(tendenciaPost.fechaPublicacion)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin datos recientes</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {/* Nota: Esto es aproximado en vista paginada, idealmente el server daría stats */}
              Publicado
            </div>
            <p className="text-sm text-muted-foreground">Estado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">Borrador</div>
            <p className="text-sm text-muted-foreground">Estado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-base hidden sm:block">Posts</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant={filtros.estado === undefined ? 'default' : 'outline'}
                size="sm"
                onClick={() => cargarPosts({ estado: undefined })}
                className="flex-1 sm:flex-none"
              >
                Todos
              </Button>
              <Button
                variant={filtros.estado === 'publicado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => cargarPosts({ estado: 'publicado' })}
                className="flex-1 sm:flex-none"
              >
                Publicados
              </Button>
              <Button
                variant={filtros.estado === 'borrador' ? 'default' : 'outline'}
                size="sm"
                onClick={() => cargarPosts({ estado: 'borrador' })}
                className="flex-1 sm:flex-none"
              >
                Borradores
              </Button>
            </div>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posts (título, contenido)..."
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No se encontraron posts</p>
              <Button onClick={handleNuevo}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primer post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort('titulo')}>
                      <div className="flex items-center">Título <SortIcon campo="titulo" /></div>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort('fecha')}>
                      <div className="flex items-center">Fecha <SortIcon campo="fecha" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleSort('vistas')}>
                      <div className="flex items-center">Vistas <SortIcon campo="vistas" /></div>
                    </TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium">{post.titulo}</div>
                        {post.extracto && (
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {post.extracto}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.estado === 'publicado' ? 'default' : 'secondary'}>
                          {post.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(post.fechaPublicacion || post.fechaCreacion)}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.vistas || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditar(post)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            {post.estado === 'borrador' && (
                              <DropdownMenuItem onClick={() => publicarPost(post.id)}>
                                <Send className="mr-2 h-4 w-4" />
                                Publicar
                              </DropdownMenuItem>
                            )}
                            {post.estado === 'publicado' && (
                              <DropdownMenuItem onClick={() => despublicarPost(post.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Despublicar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setPostAEliminar(post)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Footer */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Página {pagina} de {totalPaginas}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarPagina(pagina - 1)}
                    disabled={pagina <= 1 || cargando}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarPagina(pagina + 1)}
                    disabled={pagina >= totalPaginas || cargando}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!postAEliminar} onOpenChange={() => setPostAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente
              <strong> {postAEliminar?.titulo}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEliminar}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
