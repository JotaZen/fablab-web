"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Checkbox } from '@/shared/ui/inputs/checkbox';
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import type { UsuarioInput } from '../../domain/users';
import { ROLES, type RoleDefinition } from '../../domain/permissions';

interface UserFormProps {
  initialData?: Partial<UsuarioInput> & { id?: string | number };
  onGuardar: (data: UsuarioInput) => Promise<void>;
  onVolver: () => void;
  cargando: boolean;
}

export function UserForm({ initialData, onGuardar, onVolver, cargando }: UserFormProps) {
  const [username, setUsername] = useState(initialData?.username || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [apellido, setApellido] = useState(initialData?.apellido || '');
  const [roles, setRoles] = useState<string[]>(initialData?.roles || ['authenticated']);
  const [bloqueado, setBloqueado] = useState(initialData?.bloqueado || false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const esEdicion = !!initialData?.id;

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!username.trim()) {
      nuevosErrores.username = 'El nombre de usuario es requerido';
    } else if (username.length < 3) {
      nuevosErrores.username = 'Mínimo 3 caracteres';
    }

    if (!email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!esEdicion && !password) {
      nuevosErrores.password = 'La contraseña es requerida';
    } else if (password && password.length < 6) {
      nuevosErrores.password = 'Mínimo 6 caracteres';
    }

    if (roles.length === 0) {
      nuevosErrores.roles = 'Selecciona al menos un rol';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    const data: UsuarioInput = {
      username: username.trim(),
      email: email.trim(),
      nombre: nombre.trim() || undefined,
      apellido: apellido.trim() || undefined,
      roles,
      bloqueado,
    };

    if (password) {
      data.password = password;
    }

    await onGuardar(data);
  };

  const toggleRol = (rolId: string) => {
    setRoles(prev => {
      if (prev.includes(rolId)) {
        // No permitir quitar el último rol
        if (prev.length === 1) return prev;
        return prev.filter(r => r !== rolId);
      }
      return [...prev, rolId];
    });
  };

  // Roles disponibles para asignar
  const rolesDisponibles = Object.values(ROLES).filter(r => r.id !== 'super_admin');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={onVolver}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">
            {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {esEdicion ? 'Modifica los datos del usuario' : 'Crea una nueva cuenta de usuario'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Datos básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos de la cuenta del usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario123"
                className={errores.username ? 'border-destructive' : ''}
              />
              {errores.username && (
                <p className="text-sm text-destructive">{errores.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                className={errores.email ? 'border-destructive' : ''}
              />
              {errores.email && (
                <p className="text-sm text-destructive">{errores.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña {esEdicion ? '(dejar vacío para no cambiar)' : '*'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={esEdicion ? '••••••••' : 'Mínimo 6 caracteres'}
                  className={errores.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  {mostrarPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errores.password && (
                <p className="text-sm text-destructive">{errores.password}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="bloqueado"
                checked={bloqueado}
                onCheckedChange={(checked: boolean | 'indeterminate') => setBloqueado(checked === true)}
              />
              <Label htmlFor="bloqueado" className="text-sm font-normal">
                Usuario bloqueado (no puede iniciar sesión)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Roles y Permisos</CardTitle>
            <CardDescription>Selecciona los roles del usuario</CardDescription>
          </CardHeader>
          <CardContent>
            {errores.roles && (
              <p className="text-sm text-destructive mb-4">{errores.roles}</p>
            )}
            <div className="space-y-3">
              {rolesDisponibles.map((rol) => (
                <div
                  key={rol.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    roles.includes(rol.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleRol(rol.id)}
                >
                  <Checkbox
                    checked={roles.includes(rol.id)}
                    onCheckedChange={() => toggleRol(rol.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{rol.nombre}</p>
                    <p className="text-sm text-muted-foreground">{rol.descripcion}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rol.permisos.length} permisos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onVolver}>
          Cancelar
        </Button>
        <Button type="submit" disabled={cargando}>
          {cargando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {esEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
