"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { 
  Plus, 
  Tag, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  FolderTree,
  CornerDownRight
} from 'lucide-react';
import type { Termino, Vocabulario, Breadcrumb } from '../../../domain/entities';

interface TerminosListProps {
  terminos: Termino[];
  vocabulario?: Vocabulario;
  breadcrumbs?: Breadcrumb[];
  cargando: boolean;
  onCrear?: (nombre: string, vocabularioId: string, descripcion?: string, padreId?: string) => Promise<void>;
  onEliminar?: (id: string) => Promise<void>;
  onVolver?: () => void;
  pagina?: number;
  totalPaginas?: number;
  onPaginar?: (pagina: number) => void;
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

  return raices;
}

/** Componente para renderizar un término y sus hijos */
function TerminoItem({
  termino,
  nivel = 0,
  onEliminar,
  onCrearHijo,
  expandidos,
  toggleExpandido,
}: {
  termino: TerminoConHijos;
  nivel?: number;
  onEliminar?: (id: string) => Promise<void>;
  onCrearHijo?: (padreId: string) => void;
  expandidos: Set<string>;
  toggleExpandido: (id: string) => void;
}) {
  const tieneHijos = termino.hijos.length > 0;
  const estaExpandido = expandidos.has(termino.id);

  return (
    <div className="select-none">
      <div
        className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
        style={{ marginLeft: nivel * 24 }}
      >
        <div className="flex items-center gap-2">
          {/* Botón expandir/colapsar */}
          {tieneHijos ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => toggleExpandido(termino.id)}
            >
              {estaExpandido ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6 flex justify-center">
              {nivel > 0 && <CornerDownRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          )}
          
          <Tag className="h-4 w-4 text-primary" />
          <div>
            <div className="font-medium flex items-center gap-2">
              {termino.nombre}
              {tieneHijos && (
                <Badge variant="outline" className="text-xs">
                  {termino.hijos.length}
                </Badge>
              )}
            </div>
            {termino.descripcion && (
              <div className="text-sm text-muted-foreground">
                {termino.descripcion}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onCrearHijo && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onCrearHijo(termino.id)}
              title="Agregar sub-término"
            >
              <Plus className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          {onEliminar && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEliminar(termino.id)}
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      {/* Hijos recursivos */}
      {tieneHijos && estaExpandido && (
        <div className="mt-1 space-y-1">
          {termino.hijos.map(hijo => (
            <TerminoItem
              key={hijo.id}
              termino={hijo}
              nivel={nivel + 1}
              onEliminar={onEliminar}
              onCrearHijo={onCrearHijo}
              expandidos={expandidos}
              toggleExpandido={toggleExpandido}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TerminosList({
  terminos,
  vocabulario,
  breadcrumbs,
  cargando,
  onCrear,
  onEliminar,
  onVolver,
  pagina = 1,
  totalPaginas = 1,
  onPaginar,
}: TerminosListProps) {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [padreSeleccionado, setPadreSeleccionado] = useState<string | undefined>();
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [creando, setCreando] = useState(false);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const arbolTerminos = useMemo(() => construirArbol(terminos), [terminos]);

  const listaPlana = useMemo(() => {
    if (!busqueda) return [];
    return terminos.filter(t => 
      t.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [terminos, busqueda]);

  const toggleExpandido = (id: string) => {
    setExpandidos(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandirTodos = () => {
    setExpandidos(new Set(terminos.map(t => t.id)));
  };

  const colapsarTodos = () => {
    setExpandidos(new Set());
  };

  const handleCrearHijo = (padreId: string) => {
    setPadreSeleccionado(padreId);
    setMostrarFormulario(true);
    setExpandidos(prev => new Set([...prev, padreId]));
  };

  const handleCrear = async () => {
    if (!nuevoNombre.trim() || !onCrear || !vocabulario) return;
    setCreando(true);
    try {
      await onCrear(
        nuevoNombre.trim(), 
        vocabulario.id, 
        nuevaDescripcion.trim() || undefined,
        padreSeleccionado
      );
      setNuevoNombre('');
      setNuevaDescripcion('');
      setMostrarFormulario(false);
      setPadreSeleccionado(undefined);
    } finally {
      setCreando(false);
    }
  };

  const padreNombre = padreSeleccionado 
    ? terminos.find(t => t.id === padreSeleccionado)?.nombre 
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onVolver && (
              <Button size="icon" variant="ghost" onClick={onVolver}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                {vocabulario ? vocabulario.nombre : 'Términos'}
              </CardTitle>
              <CardDescription>
                {vocabulario?.descripcion || 'Elementos de clasificación jerárquica'}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {terminos.length > 0 && (
              <>
                <Button size="sm" variant="ghost" onClick={expandirTodos}>
                  Expandir
                </Button>
                <Button size="sm" variant="ghost" onClick={colapsarTodos}>
                  Colapsar
                </Button>
              </>
            )}
            {onCrear && vocabulario && (
              <Button
                size="sm"
                onClick={() => {
                  setPadreSeleccionado(undefined);
                  setMostrarFormulario(!mostrarFormulario);
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Nuevo
              </Button>
            )}
          </div>
        </div>
        
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            {breadcrumbs.map((bc, idx) => (
              <span key={bc.id} className="flex items-center gap-1">
                {idx > 0 && <ChevronRight className="h-3 w-3" />}
                <span>{bc.nombre}</span>
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar término..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>

        {mostrarFormulario && onCrear && vocabulario && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            {padreNombre && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CornerDownRight className="h-4 w-4" />
                <span>Creando sub-término de: <strong>{padreNombre}</strong></span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setPadreSeleccionado(undefined)}
                >
                  Crear en raíz
                </Button>
              </div>
            )}
            <Input
              placeholder="Nombre del término"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              autoFocus
            />
            <Input
              placeholder="Descripción (opcional)"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCrear}
                disabled={!nuevoNombre.trim() || creando}
              >
                {creando ? 'Creando...' : padreSeleccionado ? 'Crear sub-término' : 'Crear término'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setMostrarFormulario(false);
                  setPadreSeleccionado(undefined);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {cargando ? (
          <div className="py-8 text-center text-muted-foreground">
            Cargando términos...
          </div>
        ) : !vocabulario ? (
          <div className="py-8 text-center text-muted-foreground">
            <FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            Selecciona un vocabulario para ver sus términos
          </div>
        ) : terminos.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            No hay términos en este vocabulario
          </div>
        ) : busqueda ? (
          <div className="space-y-2">
            {listaPlana.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No se encontraron términos
              </div>
            ) : (
              listaPlana.map(termino => (
                <div
                  key={termino.id}
                  className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">{termino.nombre}</div>
                      {termino.descripcion && (
                        <div className="text-sm text-muted-foreground">
                          {termino.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                  {termino.padreId && (
                    <Badge variant="secondary" className="text-xs">
                      Sub-término
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {arbolTerminos.map(termino => (
              <TerminoItem
                key={termino.id}
                termino={termino}
                onEliminar={onEliminar}
                onCrearHijo={onCrear ? handleCrearHijo : undefined}
                expandidos={expandidos}
                toggleExpandido={toggleExpandido}
              />
            ))}
          </div>
        )}

        {totalPaginas > 1 && onPaginar && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPaginar(pagina - 1)}
              disabled={pagina <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {pagina} de {totalPaginas}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPaginar(pagina + 1)}
              disabled={pagina >= totalPaginas}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {terminos.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            {terminos.length} término{terminos.length !== 1 ? 's' : ''} 
            {arbolTerminos.length !== terminos.length && ` (${arbolTerminos.length} raíces)`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
