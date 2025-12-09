"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/misc/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/misc/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/inputs/select";
import {
  Plus,
  Tag,
  Trash2,
  Search,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Folder,
  FolderPlus,
  CornerDownRight,
  Pencil,
  MoreHorizontal
} from 'lucide-react';
import type { Termino, Vocabulario, Breadcrumb } from '../../../domain/entities/taxonomy';

interface TerminosListProps {
  terminos: Termino[];
  vocabulario?: Vocabulario;
  tipoLabel?: string; // "Categoría", "Marca", "Etiqueta"
  breadcrumbs?: Breadcrumb[];
  cargando: boolean;
  onCrear?: (data: Partial<Termino>) => Promise<Termino>;
  onActualizar?: (id: string, data: Partial<Termino>) => Promise<Termino>;
  onEliminar?: (id: string) => Promise<void>;
  onVolver?: () => void;
}

interface TerminoConHijos extends Termino {
  hijos: TerminoConHijos[];
}

/** Construye árbol jerárquico de términos */
function construirArbol(terminos: Termino[]): TerminoConHijos[] {
  const terminosMap = new Map<string, TerminoConHijos>();
  const raices: TerminoConHijos[] = [];

  // Crear nodos con array de hijos vacío
  terminos.forEach(t => {
    terminosMap.set(t.id, { ...t, hijos: [] });
  });

  // Construir relaciones padre-hijo
  terminos.forEach(t => {
    const nodo = terminosMap.get(t.id)!;
    if (t.padreId && terminosMap.has(t.padreId)) {
      terminosMap.get(t.padreId)!.hijos.push(nodo);
    } else {
      raices.push(nodo);
    }
  });

  // Ordenar por nombre
  const ordenar = (nodos: TerminoConHijos[]) => {
    nodos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    nodos.forEach(n => ordenar(n.hijos));
  };
  ordenar(raices);

  return raices;
}

/** Componente para renderizar un término y sus hijos */
function TerminoItem({
  termino,
  nivel = 0,
  onEditar,
  onEliminar,
  onCrearHijo,
  expandidos,
  toggleExpandido,
}: {
  termino: TerminoConHijos;
  nivel?: number;
  onEditar: (termino: Termino) => void;
  onEliminar?: (id: string) => Promise<void>;
  onCrearHijo?: (padreId: string) => void;
  expandidos: Set<string>;
  toggleExpandido: (id: string) => void;
}) {
  const tieneHijos = termino.hijos.length > 0;
  const estaExpandido = expandidos.has(termino.id);

  return (
    <div className="select-none text-sm">
      <div
        className="group flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent/50 transition-colors"
        style={{ paddingLeft: (nivel * 16) + 8 }}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {/* Botón expandir/colapsar o spacer */}
          <div className="w-4 flex justify-center flex-shrink-0">
            {tieneHijos ? (
              <button
                className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandido(termino.id);
                }}
              >
                {estaExpandido ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              // Conector visual para hojas (opcional)
              null
            )}
          </div>

          <div className="flex items-center gap-2 truncate" title={termino.descripcion || undefined}>
            <Tag className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            <span className="font-medium truncate">{termino.nombre}</span>
            {tieneHijos && !estaExpandido && (
              <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-muted-foreground/30 text-muted-foreground">
                {termino.hijos.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Acciones - todas en hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onCrearHijo && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1"
              onClick={() => onCrearHijo(termino.id)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Agregar</span>
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onEditar(termino)}
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          {onEliminar && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  title="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar "{termino.nombre}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente este elemento
                    {termino.hijos.length > 0 && ` y sus ${termino.hijos.length} sub-elementos`}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onEliminar(termino.id)}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {tieneHijos && estaExpandido && (
        <div className="relative">
          {/* Línea guía vertical opcional */}
          <div
            className="absolute left-[calc(8px+8px)] top-0 bottom-0 w-px bg-border/40"
            style={{ left: (nivel * 16) + 19 }}
          />
          <div className="">
            {termino.hijos.map(hijo => (
              <TerminoItem
                key={hijo.id}
                termino={hijo}
                nivel={nivel + 1}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onCrearHijo={onCrearHijo}
                expandidos={expandidos}
                toggleExpandido={toggleExpandido}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TerminosList({
  terminos,
  vocabulario,
  tipoLabel = 'Categoría',
  cargando,
  onCrear,
  onActualizar,
  onEliminar,
}: TerminosListProps) {
  const [busqueda, setBusqueda] = useState('');
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoTermino, setEditandoTermino] = useState<Termino | null>(null);

  // Form State
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formPadreId, setFormPadreId] = useState<string>('root');
  const [guardando, setGuardando] = useState(false);

  const arbolTerminos = useMemo(() => construirArbol(terminos), [terminos]);

  // Lista plana para el Select (excluyendo el término actual y sus hijos para evitar ciclos)
  const opcionesPadre = useMemo(() => {
    let lista = [...terminos].sort((a, b) => a.nombre.localeCompare(b.nombre));

    if (editandoTermino) {
      // Excluirse a sí mismo
      lista = lista.filter(t => t.id !== editandoTermino.id);
      // TODO: Excluir descendientes para evitar ciclos (más complejo, por ahora simple check)
    }
    return lista;
  }, [terminos, editandoTermino]);

  // Manejadores de Estado
  const toggleExpandido = (id: string) => {
    setExpandidos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandirTodos = () => setExpandidos(new Set(terminos.map(t => t.id)));
  const colapsarTodos = () => setExpandidos(new Set());

  // Manejadores de Diálogo
  const abrirCrear = () => {
    setEditandoTermino(null);
    setFormNombre('');
    setFormDescripcion('');
    setFormPadreId('root');
    setDialogOpen(true);
  };

  const abrirCrearHijo = (padreId: string) => {
    setEditandoTermino(null);
    setFormNombre('');
    setFormDescripcion('');
    setFormPadreId(padreId);
    setDialogOpen(true);
    // Expandir el padre para ver el hijo cuando se cree
    setExpandidos(prev => new Set(prev).add(padreId));
  };

  const abrirEditar = (termino: Termino) => {
    setEditandoTermino(termino);
    setFormNombre(termino.nombre);
    setFormDescripcion(termino.descripcion || '');
    setFormPadreId(termino.padreId || 'root');
    setDialogOpen(true);
  };

  const guardar = async () => {
    if (!vocabulario) return;
    setGuardando(true);
    try {
      const padreId = formPadreId === 'root' ? undefined : formPadreId;
      const data = {
        nombre: formNombre.trim(),
        descripcion: formDescripcion.trim() || undefined,
        vocabularioId: vocabulario.id,
        padreId,
      };

      if (editandoTermino && onActualizar) {
        await onActualizar(editandoTermino.id, data);
      } else if (onCrear) {
        await onCrear(data);
      }
      setDialogOpen(false);
    } finally {
      setGuardando(false);
    }
  };

  const listaFiltrada = useMemo(() => {
    if (!busqueda) return arbolTerminos;
    // Si hay búsqueda, mostramos lista plana filtrada
    return terminos.filter(t => t.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }, [busqueda, arbolTerminos, terminos]);

  if (cargando && terminos.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Cargando catálogo...</div>;
  }

  if (!vocabulario) return null;

  return (
    <Card className="h-full flex flex-col border-none shadow-none">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Filtrar ${tipoLabel.toLowerCase()}s...`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" onClick={busqueda ? () => setBusqueda('') : colapsarTodos} disabled={terminos.length === 0}>
              {busqueda ? 'Limpiar' : 'Colapsar'}
            </Button>
            <Button size="sm" onClick={abrirCrear}>
              <Plus className="mr-1 h-4 w-4" />
              Nuevo {tipoLabel}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 flex-1 overflow-auto min-h-[300px]">
        {terminos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <FolderTree className="h-10 w-10 mb-2 opacity-50" />
            <p>No hay {tipoLabel.toLowerCase()}s creadas</p>
            <Button variant="link" onClick={abrirCrear}>Crear la primera</Button>
          </div>
        ) : busqueda ? (
          <div className="space-y-1">
            {listaFiltrada.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>{item.nombre}</span>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => abrirEditar(item as Termino)}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {arbolTerminos.map(termino => (
              <TerminoItem
                key={termino.id}
                termino={termino}
                onEditar={abrirEditar}
                onEliminar={onEliminar}
                onCrearHijo={abrirCrearHijo}
                expandidos={expandidos}
                toggleExpandido={toggleExpandido}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog para Crear / Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editandoTermino ? (
                <>
                  <Pencil className="h-5 w-5" />
                  Editar {tipoLabel}
                </>
              ) : formPadreId !== 'root' ? (
                <>
                  <FolderPlus className="h-5 w-5 text-primary" />
                  Nuevo Sub-{tipoLabel.toLowerCase()}
                </>
              ) : (
                <>
                  <FolderPlus className="h-5 w-5 text-primary" />
                  Nuevo {tipoLabel}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editandoTermino
                ? `Modifica los detalles de ${tipoLabel.toLowerCase()}`
                : `Ingresa los datos para crear una nueva ${tipoLabel.toLowerCase()}`
              }
            </DialogDescription>
            {/* Mostrar claramente dónde se va a crear */}
            {!editandoTermino && formPadreId !== 'root' && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-md">
                <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Se creará dentro de:</span>
                <Badge variant="secondary" className="font-medium">
                  {terminos.find(t => t.id === formPadreId)?.nombre || tipoLabel}
                </Badge>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={formNombre}
                onChange={e => setFormNombre(e.target.value)}
                placeholder="Ej. Impresoras 3D"
                autoFocus
              />
            </div>

            {/* Solo mostrar selector de padre si no viene pre-seleccionado o si estamos editando */}
            {(formPadreId === 'root' || editandoTermino) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{tipoLabel} padre</label>
                <Select value={formPadreId} onValueChange={setFormPadreId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4 text-primary" />
                        <span className="font-medium">Raíz (Sin padre)</span>
                      </div>
                    </SelectItem>
                    {opcionesPadre.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-amber-500" />
                          <span>{t.nombre}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción <span className="text-muted-foreground font-normal">(opcional)</span></label>
              <Input
                value={formDescripcion}
                onChange={e => setFormDescripcion(e.target.value)}
                placeholder="Breve descripción..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={guardar} disabled={!formNombre || guardando}>
              {guardando ? 'Guardando...' : editandoTermino ? 'Guardar Cambios' : `Crear ${tipoLabel}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
