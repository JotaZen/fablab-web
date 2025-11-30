"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Users, Shield, AlertCircle, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui/buttons/button';
import { useUsers } from '@/features/auth/presentation/hooks/use-users';
import { UsersList } from '@/features/auth/presentation/components/users-list';
import { UserForm } from '@/features/auth/presentation/components/user-form';
import { RolesDialog } from '@/features/auth/presentation/components/roles-dialog';
import type { Usuario, EstadoUsuario, UsuarioInput } from '@/features/auth/domain/users';

type Vista = 'lista' | 'formulario';

export default function UsersAdminPage() {
  const {
    usuarios,
    total,
    cargando,
    error,
    cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    bloquearUsuario,
    cambiarRoles,
    limpiarError,
  } = useUsers();

  const [vista, setVista] = useState<Vista>('lista');
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [usuarioRoles, setUsuarioRoles] = useState<Usuario | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoUsuario | undefined>();
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios({ estado: estadoFiltro, busqueda: busqueda || undefined });
  }, [cargarUsuarios, estadoFiltro, busqueda]);

  const handleNuevo = () => {
    setUsuarioEditando(null);
    setVista('formulario');
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setVista('formulario');
  };

  const handleVolver = () => {
    setVista('lista');
    setUsuarioEditando(null);
  };

  const handleGuardar = async (data: UsuarioInput) => {
    if (usuarioEditando) {
      await actualizarUsuario(usuarioEditando.id, data);
    } else {
      await crearUsuario(data);
    }
    handleVolver();
  };

  // Stats
  const activos = usuarios.filter(u => !u.bloqueado).length;
  const bloqueados = usuarios.filter(u => u.bloqueado).length;
  const admins = usuarios.filter(u => 
    u.roles.some(r => ['admin', 'super_admin'].includes(r))
  ).length;

  if (vista === 'formulario') {
    return (
      <div className="space-y-6">
        <UserForm
          initialData={usuarioEditando ? {
            id: usuarioEditando.id,
            username: usuarioEditando.username,
            email: usuarioEditando.email,
            nombre: usuarioEditando.nombre,
            apellido: usuarioEditando.apellido,
            roles: usuarioEditando.roles,
            bloqueado: usuarioEditando.bloqueado,
          } : undefined}
          onGuardar={handleGuardar}
          onVolver={handleVolver}
          cargando={cargando}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios y sus permisos en el sistema
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
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bloqueados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuarios */}
      <UsersList
        usuarios={usuarios}
        cargando={cargando}
        onNuevo={handleNuevo}
        onEditar={handleEditar}
        onEliminar={eliminarUsuario}
        onBloquear={bloquearUsuario}
        onCambiarRoles={setUsuarioRoles}
        onBuscar={setBusqueda}
        onFiltrarEstado={setEstadoFiltro}
        estadoFiltro={estadoFiltro}
      />

      {/* Dialog de Roles */}
      <RolesDialog
        usuario={usuarioRoles}
        open={!!usuarioRoles}
        onClose={() => setUsuarioRoles(null)}
        onGuardar={cambiarRoles}
      />
    </div>
  );
}
