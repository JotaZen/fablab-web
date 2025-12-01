/**
 * Lista de Recintos
 * 
 * Componente que muestra los recintos de una sede
 */

"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { 
  Plus, 
  Box, 
  ChevronRight, 
  Trash2, 
  Search, 
  Edit2,
  Layers
} from 'lucide-react';
import type { Venue, CreateVenueDTO, VenueType } from '../../../domain/entities/location';

interface ListaRecintosProps {
  recintos: Venue[];
  cargando: boolean;
  sedeId?: string;
  nombreSede?: string;
  onSeleccionar: (recinto: Venue) => void;
  onCrear?: (data: CreateVenueDTO) => Promise<void>;
  onEliminar?: (id: string) => Promise<void>;
  onEditar?: (recinto: Venue) => void;
  recintoSeleccionadoId?: string;
}

/** Tipos de recinto con etiquetas en español */
const TIPOS_RECINTO: { valor: VenueType; etiqueta: string }[] = [
  { valor: 'laboratory', etiqueta: 'Laboratorio' },
  { valor: 'warehouse', etiqueta: 'Bodega' },
  { valor: 'workshop', etiqueta: 'Taller' },
  { valor: 'office', etiqueta: 'Oficina' },
  { valor: 'storage', etiqueta: 'Pañol' },
  { valor: 'other', etiqueta: 'Otro' },
];

export function ListaRecintos({
  recintos,
  cargando,
  sedeId,
  nombreSede,
  onSeleccionar,
  onCrear,
  onEliminar,
  onEditar,
  recintoSeleccionadoId,
}: ListaRecintosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<VenueType>('laboratory');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [creando, setCreando] = useState(false);

  const recintosFiltrados = recintos.filter(r =>
    r.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    obtenerEtiquetaTipo(r.type).toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCrear = async () => {
    if (!nuevoNombre.trim() || !nuevoCodigo.trim() || !sedeId || !onCrear) return;
    setCreando(true);
    try {
      await onCrear({
        name: nuevoNombre.trim(),
        code: nuevoCodigo.trim().toUpperCase(),
        type: nuevoTipo,
        locationId: sedeId,
        description: nuevaDescripcion.trim() || undefined,
      });
      setNuevoNombre('');
      setNuevoCodigo('');
      setNuevoTipo('laboratory');
      setNuevaDescripcion('');
      setMostrarFormulario(false);
    } finally {
      setCreando(false);
    }
  };

  const obtenerColorTipo = (tipo: VenueType): string => {
    switch (tipo) {
      case 'laboratory':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'warehouse':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'office':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'workshop':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'storage':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const obtenerEtiquetaTipo = (tipo: VenueType): string => {
    return TIPOS_RECINTO.find(t => t.valor === tipo)?.etiqueta || tipo;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recintos</CardTitle>
            <CardDescription>
              {nombreSede 
                ? `Espacios en ${nombreSede}` 
                : 'Selecciona una sede para ver sus recintos'}
            </CardDescription>
          </div>
          {onCrear && sedeId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Nuevo Recinto
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!sedeId ? (
          <div className="py-8 text-center text-muted-foreground">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecciona una sede para ver sus recintos</p>
          </div>
        ) : (
          <>
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar recinto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Formulario de creación */}
            {mostrarFormulario && onCrear && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <Input
                  placeholder="Nombre del recinto *"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                />
                <Input
                  placeholder="Código (ej: LAB-01) *"
                  value={nuevoCodigo}
                  onChange={(e) => setNuevoCodigo(e.target.value)}
                />
                <select
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value as VenueType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {TIPOS_RECINTO.map((tipo) => (
                    <option key={tipo.valor} value={tipo.valor}>
                      {tipo.etiqueta}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Descripción (opcional)"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCrear}
                    disabled={!nuevoNombre.trim() || !nuevoCodigo.trim() || creando}
                  >
                    {creando ? 'Creando...' : 'Crear'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Lista de recintos */}
            {cargando ? (
              <div className="py-8 text-center text-muted-foreground">
                Cargando recintos...
              </div>
            ) : recintosFiltrados.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {busqueda ? 'No se encontraron recintos' : 'No hay recintos en esta sede'}
              </div>
            ) : (
              <div className="space-y-2">
                {recintosFiltrados.map((recinto) => {
                  const estaSeleccionado = recintoSeleccionadoId === recinto.id;

                  return (
                    <div
                      key={recinto.id}
                      className={`group flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer hover:bg-accent ${
                        estaSeleccionado ? 'bg-accent border-primary' : ''
                      }`}
                      onClick={() => onSeleccionar(recinto)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Box className="h-5 w-5 text-primary shrink-0" />
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{recinto.name}</span>
                            <Badge className={`shrink-0 ${obtenerColorTipo(recinto.type)}`}>
                              {obtenerEtiquetaTipo(recinto.type)}
                            </Badge>
                          </div>
                          {recinto.description && (
                            <div className="text-sm text-muted-foreground truncate">
                              {recinto.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {onEditar && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditar(recinto);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {onEliminar && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`¿Eliminar el recinto "${recinto.name}"?`)) {
                                onEliminar(recinto.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
