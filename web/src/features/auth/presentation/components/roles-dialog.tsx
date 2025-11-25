"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/misc/dialog';
import { Button } from '@/shared/ui/buttons/button';
import { Checkbox } from '@/shared/ui/inputs/checkbox';
import { Badge } from '@/shared/ui/badges/badge';
import { Loader2, Shield } from 'lucide-react';
import type { Usuario } from '../../domain/users';
import { ROLES, translatePermission, type Permission } from '../../domain/permissions';

interface RolesDialogProps {
  usuario: Usuario | null;
  open: boolean;
  onClose: () => void;
  onGuardar: (id: string | number, roles: string[]) => Promise<void>;
}

export function RolesDialog({ usuario, open, onClose, onGuardar }: RolesDialogProps) {
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>(
    usuario?.roles || []
  );
  const [guardando, setGuardando] = useState(false);
  const [rolExpandido, setRolExpandido] = useState<string | null>(null);

  // Sincronizar cuando cambia el usuario
  if (usuario && rolesSeleccionados.length === 0 && usuario.roles.length > 0) {
    setRolesSeleccionados(usuario.roles);
  }

  const toggleRol = (rolId: string) => {
    setRolesSeleccionados(prev => {
      if (prev.includes(rolId)) {
        if (prev.length === 1) return prev; // Mantener al menos uno
        return prev.filter(r => r !== rolId);
      }
      return [...prev, rolId];
    });
  };

  const handleGuardar = async () => {
    if (!usuario) return;
    setGuardando(true);
    try {
      await onGuardar(usuario.id, rolesSeleccionados);
      onClose();
    } finally {
      setGuardando(false);
    }
  };

  const handleClose = () => {
    setRolesSeleccionados(usuario?.roles || []);
    setRolExpandido(null);
    onClose();
  };

  const rolesDisponibles = Object.values(ROLES).filter(r => r.id !== 'super_admin');

  // Calcular permisos totales de los roles seleccionados
  const permisosTotal = [...new Set(
    rolesSeleccionados.flatMap(rolId => ROLES[rolId]?.permisos || [])
  )];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestionar Roles
          </DialogTitle>
          <DialogDescription>
            Asigna roles a <strong>{usuario?.username}</strong>. Los permisos se combinan de todos los roles asignados.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Lista de roles */}
          <div className="space-y-2">
            {rolesDisponibles.map((rol) => (
              <div key={rol.id} className="border rounded-lg overflow-hidden">
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    rolesSeleccionados.includes(rol.id)
                      ? 'bg-primary/5 border-l-4 border-l-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleRol(rol.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={rolesSeleccionados.includes(rol.id)}
                      onCheckedChange={() => toggleRol(rol.id)}
                    />
                    <div>
                      <p className="font-medium">{rol.nombre}</p>
                      <p className="text-sm text-muted-foreground">{rol.descripcion}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRolExpandido(rolExpandido === rol.id ? null : rol.id);
                    }}
                  >
                    {rolExpandido === rol.id ? 'Ocultar' : 'Ver permisos'}
                  </Button>
                </div>
                
                {rolExpandido === rol.id && (
                  <div className="px-3 pb-3 pt-1 bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">
                      {rol.permisos.length} permisos incluidos:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rol.permisos.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {translatePermission(perm)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Resumen de permisos */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">
              Permisos resultantes ({permisosTotal.length}):
            </p>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {permisosTotal.map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs">
                  {translatePermission(perm)}
                </Badge>
              ))}
              {permisosTotal.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin permisos asignados</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={guardando}>
            {guardando ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Roles'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
