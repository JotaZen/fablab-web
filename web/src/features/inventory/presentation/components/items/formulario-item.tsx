/**
 * Formulario de Item
 * 
 * Para crear y editar artículos del catálogo
 */

"use client";

import { useState, ChangeEvent } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/inputs/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/misc/dialog';
import { Loader2 } from 'lucide-react';
import type { Item, CrearItemDTO, EstadoItem } from '../../../domain/entities/item';
import { ESTADO_ITEM_LABELS } from '../../../domain/labels';

interface FormularioItemProps {
  item?: Item | null;
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (data: CrearItemDTO) => Promise<void>;
  cargando?: boolean;
}

const ESTADOS: EstadoItem[] = ['active', 'draft', 'archived'];

export function FormularioItem({
  item,
  abierto,
  onCerrar,
  onGuardar,
  cargando = false,
}: FormularioItemProps) {
  const esEdicion = !!item;

  const [nombre, setNombre] = useState(item?.nombre || '');
  const [descripcion, setDescripcion] = useState(item?.descripcion || '');
  const [notas, setNotas] = useState(item?.notas || '');
  const [estado, setEstado] = useState<EstadoItem>(item?.estado || 'active');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when item changes
  const resetForm = () => {
    setNombre(item?.nombre || '');
    setDescripcion(item?.descripcion || '');
    setNotas(item?.notas || '');
    setEstado(item?.estado || 'active');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        notas: notas.trim() || undefined,
        estado,
      });
      onCerrar();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCerrar();
      // Reset después de cerrar
      setTimeout(resetForm, 200);
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {esEdicion ? 'Editar Artículo' : 'Nuevo Artículo'}
            </DialogTitle>
            <DialogDescription>
              {esEdicion 
                ? 'Modifica los datos del artículo'
                : 'Ingresa los datos del nuevo artículo del catálogo'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Lápices Camptech"
                disabled={guardando}
              />
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del artículo..."
                rows={3}
                disabled={guardando}
              />
            </div>

            {/* Notas */}
            <div className="grid gap-2">
              <Label htmlFor="notas">Observaciones</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas internas..."
                rows={2}
                disabled={guardando}
              />
            </div>

            {/* Estado */}
            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={estado}
                onValueChange={(v: string) => setEstado(v as EstadoItem)}
                disabled={guardando}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((e) => (
                    <SelectItem key={e} value={e}>
                      {ESTADO_ITEM_LABELS[e]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {esEdicion ? 'Guardar Cambios' : 'Crear Artículo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
