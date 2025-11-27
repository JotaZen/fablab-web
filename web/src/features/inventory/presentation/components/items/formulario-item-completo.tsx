/**
 * Formulario de Item Completo
 * 
 * Incluye: nombre, descripción, UoM, categoría, marca, tags, ubicación
 * 
 * Estructura de Locaciones:
 * - Locación (warehouse): puede tener hijos
 * - Unidad de Almacenamiento (storage_unit): NO puede tener hijos
 */

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import { Badge } from '@/shared/ui/badges/badge';
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
import { 
  Loader2, 
  Package, 
  MapPin, 
  Tag, 
  Ruler,
  X,
  Warehouse,
  Box
} from 'lucide-react';
import type { Item, CrearItemDTO, EstadoItem } from '../../../domain/entities';
import { ESTADO_ITEM_LABELS } from '../../../domain/entities';
import { useSelectoresItem } from '../../hooks/use-selectores-item';
import { TIPO_LOCACION_LABELS } from '../../../infrastructure/api/location-client';

interface FormularioItemCompletoProps {
  item?: Item | null;
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (data: CrearItemDTO) => Promise<void>;
  cargando?: boolean;
}

const ESTADOS: EstadoItem[] = ['active', 'draft', 'archived'];

export function FormularioItemCompleto({
  item,
  abierto,
  onCerrar,
  onGuardar,
  cargando = false,
}: FormularioItemCompletoProps) {
  const esEdicion = !!item;
  const selectores = useSelectoresItem();

  // Campos básicos
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState<EstadoItem>('active');
  
  // Campos adicionales
  const [uomId, setUomId] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [marcaId, setMarcaId] = useState<string>('');
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);
  
  // Ubicación: solo una locación (puede ser warehouse o storage_unit)
  const [locacionId, setLocacionId] = useState<string>('');

  // Estado UI
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Locaciones raíz (sin padre) para el primer nivel
  const locacionesRaiz = useMemo(() => {
    return selectores.locaciones.filter(loc => !loc.padreId);
  }, [selectores.locaciones]);

  // Hijos de la locación seleccionada
  const hijosLocacion = useMemo(() => {
    if (!locacionId) return [];
    return selectores.hijosDeLocacion(locacionId);
  }, [locacionId, selectores]);

  // Reset form cuando cambia el item
  useEffect(() => {
    if (abierto) {
      setNombre(item?.nombre || '');
      setDescripcion(item?.descripcion || '');
      setNotas(item?.notas || '');
      setEstado(item?.estado || 'active');
      setUomId(item?.uomId || '');
      setCategoriaId('');
      setMarcaId('');
      setTagsSeleccionados([]);
      setLocacionId('');
      setError(null);
    }
  }, [abierto, item]);

  const toggleTag = (tagId: string) => {
    setTagsSeleccionados(prev => 
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
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
      // Combinar todos los term_ids
      const terminoIds: string[] = [];
      if (categoriaId) terminoIds.push(categoriaId);
      if (marcaId) terminoIds.push(marcaId);
      terminoIds.push(...tagsSeleccionados);

      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        notas: notas.trim() || undefined,
        estado,
        uomId: uomId || undefined,
        terminoIds: terminoIds.length > 0 ? terminoIds : undefined,
      });
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // Obtener nombre de locación seleccionada
  const locacionSeleccionada = selectores.locaciones.find(l => l.id === locacionId);

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {esEdicion ? 'Editar Artículo' : 'Nuevo Artículo'}
            </DialogTitle>
            <DialogDescription>
              {esEdicion 
                ? 'Modifica los datos del artículo'
                : 'Completa los datos del nuevo artículo'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* === INFORMACIÓN BÁSICA === */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Información Básica
              </h4>
              
              {/* Nombre */}
              <div className="grid gap-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Arduino UNO R3"
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
                  rows={2}
                  disabled={guardando}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Estado */}
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select
                    value={estado}
                    onValueChange={(v) => setEstado(v as EstadoItem)}
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

                {/* Unidad de Medida */}
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    Unidad de Medida
                  </Label>
                  <Select
                    value={uomId || '__none__'}
                    onValueChange={(v) => setUomId(v === '__none__' ? '' : v)}
                    disabled={guardando || selectores.cargando}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Sin unidad</SelectItem>
                      {selectores.unidadesMedida.map((uom) => (
                        <SelectItem key={uom.id} value={uom.id}>
                          {uom.nombre} ({uom.simbolo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* === CLASIFICACIÓN === */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Clasificación
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {/* Categoría */}
                <div className="grid gap-2">
                  <Label>Categoría</Label>
                  <Select
                    value={categoriaId || '__none__'}
                    onValueChange={(v) => setCategoriaId(v === '__none__' ? '' : v)}
                    disabled={guardando || selectores.cargando}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Sin categoría</SelectItem>
                      {selectores.categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marca */}
                <div className="grid gap-2">
                  <Label>Marca</Label>
                  <Select
                    value={marcaId || '__none__'}
                    onValueChange={(v) => setMarcaId(v === '__none__' ? '' : v)}
                    disabled={guardando || selectores.cargando}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Sin marca</SelectItem>
                      {selectores.marcas.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              {selectores.tags.length > 0 && (
                <div className="grid gap-2">
                  <Label>Etiquetas</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30 min-h-[60px]">
                    {selectores.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={tagsSeleccionados.includes(tag.id) ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.nombre}
                        {tagsSeleccionados.includes(tag.id) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* === UBICACIÓN === */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación (opcional)
              </h4>

              {/* Selector de Locación */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-1">
                  <Warehouse className="h-3 w-3" />
                  Locación
                </Label>
                <Select
                  value={locacionId || '__none__'}
                  onValueChange={(v) => setLocacionId(v === '__none__' ? '' : v)}
                  disabled={guardando || selectores.cargando}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar locación..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sin ubicación</SelectItem>
                    
                    {/* Locaciones raíz */}
                    {locacionesRaiz.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        <span className="flex items-center gap-2">
                          {loc.tipo === 'warehouse' ? (
                            <Warehouse className="h-3 w-3" />
                          ) : (
                            <Box className="h-3 w-3" />
                          )}
                          {loc.nombre}
                          <span className="text-xs text-muted-foreground">
                            ({TIPO_LOCACION_LABELS[loc.tipo]})
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Si hay hijos, mostrar selector adicional */}
              {hijosLocacion.length > 0 && (
                <div className="grid gap-2 ml-4 pl-4 border-l-2 border-muted">
                  <Label className="flex items-center gap-1">
                    <Box className="h-3 w-3" />
                    Sub-ubicación
                  </Label>
                  <Select
                    value=""
                    onValueChange={(id) => setLocacionId(id)}
                    disabled={guardando}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sub-ubicación..." />
                    </SelectTrigger>
                    <SelectContent>
                      {hijosLocacion.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          <span className="flex items-center gap-2">
                            {loc.tipo === 'warehouse' ? (
                              <Warehouse className="h-3 w-3" />
                            ) : (
                              <Box className="h-3 w-3" />
                            )}
                            {loc.nombre}
                            <span className="text-xs text-muted-foreground">
                              ({TIPO_LOCACION_LABELS[loc.tipo]})
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Mostrar ubicación seleccionada */}
              {locacionSeleccionada && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Ubicación: <strong>{locacionSeleccionada.nombre}</strong>
                  <Badge variant="outline" className="text-xs">
                    {TIPO_LOCACION_LABELS[locacionSeleccionada.tipo]}
                  </Badge>
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="grid gap-2 pt-4 border-t">
              <Label htmlFor="notas">Observaciones internas</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas internas..."
                rows={2}
                disabled={guardando}
              />
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
