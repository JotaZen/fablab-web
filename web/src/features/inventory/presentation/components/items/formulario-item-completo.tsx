/**
 * Formulario de Item Completo
 * 
 * Diseño limpio con secciones claras y buen espaciado
 */

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent } from '@/shared/ui/cards/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/misc/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/misc/dialog';
import {
  Loader2,
  Package,
  Tag,
  Ruler,
  X,
  FileText,
  ChevronRight,
  Search,
} from 'lucide-react';
import type { Item, CrearItemDTO, EstadoItem } from '../../../domain/entities/item';
import { ESTADO_ITEM_LABELS } from '../../../domain/labels';
import { useSelectoresItem } from '../../hooks/use-selectores-item';
import type { Termino } from '../../../domain/entities/taxonomy';

interface FormularioItemCompletoProps {
  item?: Item | null;
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (data: CrearItemDTO) => Promise<void>;
  cargando?: boolean;
}

const ESTADOS: EstadoItem[] = ['active', 'draft', 'archived'];

function aplanarCategoriasConNivel(categorias: Termino[]): (Termino & { displayNivel: number })[] {
  const result: (Termino & { displayNivel: number })[] = [];
  const raices = categorias.filter(c => !c.padreId);

  function agregarConHijos(cat: Termino, nivel: number) {
    result.push({ ...cat, displayNivel: nivel });
    const hijos = categorias.filter(c => c.padreId === cat.id);
    hijos.forEach(hijo => agregarConHijos(hijo, nivel + 1));
  }

  raices.forEach(raiz => agregarConHijos(raiz, 0));
  categorias.forEach(cat => {
    if (!result.find(r => r.id === cat.id)) {
      result.push({ ...cat, displayNivel: cat.nivel || 0 });
    }
  });

  return result;
}

export function FormularioItemCompleto({
  item,
  abierto,
  onCerrar,
  onGuardar,
  cargando = false,
}: FormularioItemCompletoProps) {
  const esEdicion = !!item;
  const selectores = useSelectoresItem();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState<EstadoItem>('active');
  const [uomId, setUomId] = useState<string>('');
  const [uomBusqueda, setUomBusqueda] = useState('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [marcaId, setMarcaId] = useState<string>('');
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);

  const [tabActiva, setTabActiva] = useState('clasificacion');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoriasConNivel = useMemo(() => {
    return aplanarCategoriasConNivel(selectores.categorias);
  }, [selectores.categorias]);

  // Filtrar UoM por búsqueda
  const uomFiltradas = useMemo(() => {
    if (!uomBusqueda.trim()) return selectores.unidadesMedida;
    const termino = uomBusqueda.toLowerCase();
    return selectores.unidadesMedida.filter(uom =>
      uom.nombre.toLowerCase().includes(termino) ||
      uom.simbolo.toLowerCase().includes(termino) ||
      uom.categoria?.toLowerCase().includes(termino)
    );
  }, [selectores.unidadesMedida, uomBusqueda]);

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
      setTabActiva('clasificacion');
      setError(null);
    }
  }, [abierto, item]);

  const toggleTag = (tagId: string) => {
    setTagsSeleccionados(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
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

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="sm:max-w-[950px] p-0 gap-0 max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">

          {/* Header */}
          <DialogHeader className="px-8 py-6 border-b bg-muted/30">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              {esEdicion ? 'Editar Artículo' : 'Nuevo Artículo del Catálogo'}
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6 space-y-8">

              {/* === INFORMACIÓN PRINCIPAL === */}
              <section className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Información Principal
                </h3>

                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-base">
                    Nombre del Artículo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Arduino UNO R3, Filamento PLA 1kg, Llave Allen 5mm..."
                    disabled={guardando}
                    className="h-14 text-lg px-4"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción detallada del artículo, especificaciones técnicas..."
                    rows={3}
                    disabled={guardando}
                    className="resize-none"
                  />
                </div>

                {/* Grid: UoM + Estado */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      Unidad de Medida
                    </Label>
                    <Select
                      value={uomId || '__none__'}
                      onValueChange={(v) => setUomId(v === '__none__' ? '' : v)}
                      disabled={guardando || selectores.cargando}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccionar unidad..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px]">
                        {/* Campo de búsqueda */}
                        <div className="sticky top-0 p-2 bg-popover border-b">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar unidad..."
                              value={uomBusqueda}
                              onChange={(e) => setUomBusqueda(e.target.value)}
                              className="pl-8 h-9"
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <SelectItem value="__none__">Sin unidad de medida</SelectItem>
                        {uomFiltradas.length === 0 && uomBusqueda && (
                          <div className="py-3 px-2 text-sm text-muted-foreground text-center">
                            No se encontraron unidades
                          </div>
                        )}
                        {uomFiltradas.map((uom) => (
                          <SelectItem key={uom.id} value={uom.id}>
                            <span className="font-medium">{uom.nombre}</span>
                            <span className="text-muted-foreground ml-1">({uom.simbolo})</span>
                            {uom.categoria && (
                              <span className="text-xs text-muted-foreground ml-2">• {uom.categoria}</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado del Artículo</Label>
                    <Select
                      value={estado}
                      onValueChange={(v) => setEstado(v as EstadoItem)}
                      disabled={guardando}
                    >
                      <SelectTrigger className="h-12">
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
                </div>
              </section>

              {/* === DETALLES ADICIONALES (Tabs) === */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Detalles Adicionales
                </h3>

                <Tabs value={tabActiva} onValueChange={setTabActiva}>
                  <TabsList className="w-full justify-start h-12 p-1">
                    <TabsTrigger value="clasificacion" className="gap-2 px-6">
                      <Tag className="h-4 w-4" />
                      Clasificación
                    </TabsTrigger>
                    <TabsTrigger value="notas" className="gap-2 px-6">
                      <FileText className="h-4 w-4" />
                      Notas Internas
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab: Clasificación */}
                  <TabsContent value="clasificacion" className="mt-6">
                    <Card className="border-dashed">
                      <CardContent className="pt-6 space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          {/* Categoría */}
                          <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Select
                              value={categoriaId || '__none__'}
                              onValueChange={(v) => setCategoriaId(v === '__none__' ? '' : v)}
                              disabled={guardando || selectores.cargando}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Sin categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">Sin categoría</SelectItem>
                                {categoriasConNivel.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    <span
                                      className="flex items-center"
                                      style={{ paddingLeft: cat.displayNivel * 12 }}
                                    >
                                      {cat.displayNivel > 0 && (
                                        <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
                                      )}
                                      {cat.nombre}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Marca */}
                          <div className="space-y-2">
                            <Label>Marca</Label>
                            <Select
                              value={marcaId || '__none__'}
                              onValueChange={(v) => setMarcaId(v === '__none__' ? '' : v)}
                              disabled={guardando || selectores.cargando}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Sin marca" />
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

                        {/* Etiquetas */}
                        <div className="space-y-3">
                          <Label>Etiquetas</Label>
                          <div className="flex flex-wrap gap-2 p-4 rounded-lg border-2 border-dashed bg-muted/20 min-h-[80px]">
                            {selectores.tags.length === 0 ? (
                              <p className="text-sm text-muted-foreground m-auto">
                                No hay etiquetas disponibles
                              </p>
                            ) : (
                              selectores.tags.map((tag) => (
                                <Badge
                                  key={tag.id}
                                  variant={tagsSeleccionados.includes(tag.id) ? 'default' : 'outline'}
                                  className="cursor-pointer h-9 px-4 text-sm"
                                  onClick={() => toggleTag(tag.id)}
                                >
                                  {tag.nombre}
                                  {tagsSeleccionados.includes(tag.id) && <X className="h-3 w-3 ml-2" />}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab: Notas */}
                  <TabsContent value="notas" className="mt-6">
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <Label htmlFor="notas">Observaciones / Notas Internas</Label>
                          <Textarea
                            id="notas"
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Información adicional, instrucciones de uso, proveedores, etc..."
                            rows={6}
                            disabled={guardando}
                            className="resize-none"
                          />
                          <p className="text-xs text-muted-foreground">
                            Solo visible para el equipo interno.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-8 py-5 border-t bg-muted/30">
            {error && (
              <p className="text-sm text-destructive mr-auto">{error}</p>
            )}
            <Button type="button" variant="outline" onClick={onCerrar} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando} size="lg" className="min-w-[150px]">
              {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {esEdicion ? 'Guardar' : 'Crear Artículo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
