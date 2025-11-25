"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/misc/dropdown-menu';
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Shield,
  Ban,
  CheckCircle,
  UserCog,
  Loader2,
} from 'lucide-react';
import type { Usuario, EstadoUsuario } from '../../domain/users';
import { ROLES } from '../../domain/permissions';

interface UsersListProps {
  usuarios: Usuario[];
  cargando: boolean;
  onNuevo: () => void;
  onEditar: (usuario: Usuario) => void;
  onEliminar: (id: string | number) => Promise<void>;
  onBloquear: (id: string | number, bloqueado: boolean) => Promise<void>;
  onCambiarRoles: (usuario: Usuario) => void;
  onBuscar: (busqueda: string) => void;
  onFiltrarEstado: (estado: EstadoUsuario | undefined) => void;
  estadoFiltro?: EstadoUsuario;
}

function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fecha);
}

function getRolBadgeColor(rol: string): string {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800',
    admin: 'bg-purple-100 text-purple-800',
    editor: 'bg-blue-100 text-blue-800',
    inventory_manager: 'bg-green-100 text-green-800',
    iot_operator: 'bg-orange-100 text-orange-800',
    viewer: 'bg-gray-100 text-gray-800',
    authenticated: 'bg-slate-100 text-slate-600',
  };
  return colors[rol] || 'bg-gray-100 text-gray-800';
}

export function UsersList({
  usuarios,
  cargando,
  onNuevo,
  onEditar,
  onEliminar,
  onBloquear,
  onCambiarRoles,
  onBuscar,
  onFiltrarEstado,
  estadoFiltro,
}: UsersListProps) {
  const [busqueda, setBusqueda] = useState('');
  const [eliminando, setEliminando] = useState<string | number | null>(null);

  const handleBuscar = (value: string) => {
    setBusqueda(value);
    onBuscar(value);
  };

  const handleEliminar = async (id: string | number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }
    setEliminando(id);
    try {
      await onEliminar(id);
    } finally {
      setEliminando(null);
    }
  };

  const handleBloquear = async (usuario: Usuario) => {
    const accion = usuario.bloqueado ? 'desbloquear' : 'bloquear';
    if (!confirm(`¿Estás seguro de ${accion} a ${usuario.username}?`)) {
      return;
    }
    await onBloquear(usuario.id, !usuario.bloqueado);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usuarios del Sistema</CardTitle>
          <Button onClick={onNuevo}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={!estadoFiltro ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltrarEstado(undefined)}
            >
              Todos
            </Button>
            <Button
              variant={estadoFiltro === 'activo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltrarEstado('activo')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Activos
            </Button>
            <Button
              variant={estadoFiltro === 'bloqueado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltrarEstado('bloqueado')}
            >
              <Ban className="h-4 w-4 mr-1" />
              Bloqueados
            </Button>
          </div>
        </div>

        {/* Loading */}
        {cargando && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Lista vacía */}
        {!cargando && usuarios.length === 0 && (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay usuarios que mostrar</p>
          </div>
        )}

        {/* Tabla de usuarios */}
        {!cargando && usuarios.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Roles</th>
                  <th className="text-left py-3 px-4 font-medium">Estado</th>
                  <th className="text-left py-3 px-4 font-medium">Registro</th>
                  <th className="text-right py-3 px-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {usuario.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{usuario.username}</p>
                          {(usuario.nombre || usuario.apellido) && (
                            <p className="text-sm text-muted-foreground">
                              {[usuario.nombre, usuario.apellido].filter(Boolean).join(' ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {usuario.email}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {usuario.roles.map((rol) => (
                          <Badge key={rol} className={getRolBadgeColor(rol)} variant="secondary">
                            {ROLES[rol]?.nombre || rol}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {usuario.bloqueado ? (
                        <Badge variant="destructive">Bloqueado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Activo
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatearFecha(usuario.fechaCreacion)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {eliminando === usuario.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditar(usuario)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onCambiarRoles(usuario)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Cambiar roles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleBloquear(usuario)}>
                            {usuario.bloqueado ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Desbloquear
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-2" />
                                Bloquear
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEliminar(usuario.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
