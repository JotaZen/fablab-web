"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Clock,
  FileText,
  Send,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/misc/dropdown-menu';
import type { Post, EstadoPost } from '../../../domain/entities';

interface PostsListProps {
  posts: Post[];
  cargando: boolean;
  onEditar?: (post: Post) => void;
  onEliminar?: (id: string) => Promise<void>;
  onPublicar?: (id: string) => Promise<void>;
  onDespublicar?: (id: string) => Promise<void>;
  onNuevo?: () => void;
  onBuscar?: (busqueda: string) => void;
  onFiltrarEstado?: (estado: EstadoPost | undefined) => void;
  estadoFiltro?: EstadoPost;
}

function formatearFecha(fecha: Date | string | undefined): string {
  if (!fecha) return '';
  const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

function getEstadoBadge(estado: EstadoPost) {
  switch (estado) {
    case 'publicado':
      return <Badge className="bg-green-500">Publicado</Badge>;
    case 'borrador':
      return <Badge variant="secondary">Borrador</Badge>;
    case 'archivado':
      return <Badge variant="outline">Archivado</Badge>;
  }
}

export function PostsList({
  posts,
  cargando,
  onEditar,
  onEliminar,
  onPublicar,
  onDespublicar,
  onNuevo,
  onBuscar,
  onFiltrarEstado,
  estadoFiltro,
}: PostsListProps) {
  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar?.(busqueda);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Posts del Blog</CardTitle>
            <CardDescription>Gestiona el contenido del blog</CardDescription>
          </div>
          {onNuevo && (
            <Button onClick={onNuevo}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Post
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-4 flex-wrap">
          <form onSubmit={handleBuscar} className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar posts..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <div className="flex gap-2">
            <Button
              variant={estadoFiltro === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltrarEstado?.(undefined)}
            >
              Todos
            </Button>
            <Button
              variant={estadoFiltro === 'publicado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltrarEstado?.('publicado')}
            >
              Publicados
            </Button>
            <Button
              variant={estadoFiltro === 'borrador' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltrarEstado?.('borrador')}
            >
              Borradores
            </Button>
          </div>
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="py-12 text-center text-muted-foreground">
            Cargando posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay posts</p>
            {onNuevo && (
              <Button variant="outline" className="mt-4" onClick={onNuevo}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primer post
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{post.titulo}</h3>
                    {getEstadoBadge(post.estado)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatearFecha(post.fechaCreacion)}
                    </span>
                    {post.vistas !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.vistas} vistas
                      </span>
                    )}
                    {post.autor && (
                      <span>por {post.autor.nombre}</span>
                    )}
                  </div>
                  {post.extracto && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {post.extracto}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEditar && (
                      <DropdownMenuItem onClick={() => onEditar(post)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {post.estado === 'borrador' && onPublicar && (
                      <DropdownMenuItem onClick={() => onPublicar(post.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Publicar
                      </DropdownMenuItem>
                    )}
                    {post.estado === 'publicado' && onDespublicar && (
                      <DropdownMenuItem onClick={() => onDespublicar(post.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Despublicar
                      </DropdownMenuItem>
                    )}
                    {onEliminar && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onEliminar(post.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}

        {/* Contador */}
        {posts.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
