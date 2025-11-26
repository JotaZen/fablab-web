/**
 * Lista de Sedes
 * 
 * Componente que muestra las sedes disponibles con sus recintos
 */

"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { 
  Plus, 
  Building2, 
  ChevronRight, 
  Trash2, 
  Search, 
  MapPin,
  Edit2,
  ChevronDown,
  Box
} from 'lucide-react';
import type { Location, Venue, CreateLocationDTO, LocationType, VenueType } from '../../../domain/entities';

interface ListaSedesProps {
  sedes: Location[];
  recintos?: Venue[];
  cargando: boolean;
  onSeleccionar: (sede: Location) => void;
  onCrear?: (data: CreateLocationDTO) => Promise<void>;
  onEliminar?: (id: string) => Promise<void>;
  onEditar?: (sede: Location) => void;
  sedeSeleccionadaId?: string;
  onSeleccionarRecinto?: (recinto: Venue) => void;
}

/** Tipos de sede con etiquetas en español */
const TIPOS_SEDE: { valor: LocationType; etiqueta: string }[] = [
  { valor: 'campus', etiqueta: 'Campus' },
  { valor: 'building', etiqueta: 'Edificio' },
  { valor: 'external', etiqueta: 'Externo' },
];

/** Tipos de recinto con etiquetas en español */
const TIPOS_RECINTO: Record<VenueType, string> = {
  laboratory: 'Laboratorio',
  warehouse: 'Bodega',
  workshop: 'Taller',
  office: 'Oficina',
  storage: 'Pañol',
  other: 'Otro',
};

export function ListaSedes({
  sedes,
  recintos = [],
  cargando,
  onSeleccionar,
  onCrear,
  onEliminar,
  onEditar,
  sedeSeleccionadaId,
  onSeleccionarRecinto,
}: ListaSedesProps) {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<LocationType>('campus');
  const [nuevaDireccion, setNuevaDireccion] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [creando, setCreando] = useState(false);
  const [sedesExpandidas, setSedesExpandidas] = useState<Set<string>>(new Set());

  const sedesFiltradas = sedes.filter(s =>
    s.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.address?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCrear = async () => {
    if (!nuevoNombre.trim() || !nuevoCodigo.trim() || !onCrear) return;
    setCreando(true);
    try {
      await onCrear({
        name: nuevoNombre.trim(),
        code: nuevoCodigo.trim().toUpperCase(),
        type: nuevoTipo,
        address: nuevaDireccion.trim() || undefined,
        description: nuevaDescripcion.trim() || undefined,
      });
      setNuevoNombre('');
      setNuevoCodigo('');
      setNuevoTipo('campus');
      setNuevaDireccion('');
      setNuevaDescripcion('');
      setMostrarFormulario(false);
    } finally {
      setCreando(false);
    }
  };

  const toggleExpandir = (sedeId: string) => {
    const nuevasExpandidas = new Set(sedesExpandidas);
    if (nuevasExpandidas.has(sedeId)) {
      nuevasExpandidas.delete(sedeId);
    } else {
      nuevasExpandidas.add(sedeId);
    }
    setSedesExpandidas(nuevasExpandidas);
  };

  const obtenerRecintosDeSede = (sedeId: string) => {
    return recintos.filter(r => r.locationId === sedeId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Sedes</CardTitle>
            <CardDescription>Ubicaciones físicas del FabLab</CardDescription>
          </div>
          {onCrear && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Nueva Sede
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar sede..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Formulario de creación */}
        {mostrarFormulario && onCrear && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <Input
              placeholder="Nombre de la sede *"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <Input
              placeholder="Código (ej: CAMP, CENTRAL) *"
              value={nuevoCodigo}
              onChange={(e) => setNuevoCodigo(e.target.value)}
            />
            <select
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value as LocationType)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {TIPOS_SEDE.map((tipo) => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.etiqueta}
                </option>
              ))}
            </select>
            <Input
              placeholder="Dirección (opcional)"
              value={nuevaDireccion}
              onChange={(e) => setNuevaDireccion(e.target.value)}
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

        {/* Lista de sedes */}
        {cargando ? (
          <div className="py-8 text-center text-muted-foreground">
            Cargando sedes...
          </div>
        ) : sedesFiltradas.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {busqueda ? 'No se encontraron sedes' : 'No hay sedes registradas'}
          </div>
        ) : (
          <div className="space-y-2">
            {sedesFiltradas.map((sede) => {
              const recintosDeEstaSede = obtenerRecintosDeSede(sede.id);
              const estaExpandida = sedesExpandidas.has(sede.id);
              const estaSeleccionada = sedeSeleccionadaId === sede.id;

              return (
                <div key={sede.id} className="space-y-1">
                  <div
                    className={`group flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer hover:bg-accent ${
                      estaSeleccionada ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => onSeleccionar(sede)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Botón expandir */}
                      {recintosDeEstaSede.length > 0 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandir(sede.id);
                          }}
                        >
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform ${estaExpandida ? '' : '-rotate-90'}`} 
                          />
                        </Button>
                      )}
                      
                      <Building2 className="h-5 w-5 text-primary shrink-0" />
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{sede.name}</span>
                          <Badge variant="outline" className="shrink-0">
                            {recintosDeEstaSede.length} recintos
                          </Badge>
                        </div>
                        {sede.address && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{sede.address}</span>
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
                            onEditar(sede);
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
                            if (confirm(`¿Eliminar la sede "${sede.name}"? También se eliminarán sus recintos.`)) {
                              onEliminar(sede.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Lista de recintos (expandida) */}
                  {estaExpandida && recintosDeEstaSede.length > 0 && (
                    <div className="ml-8 pl-4 border-l-2 border-muted space-y-1">
                      {recintosDeEstaSede.map((recinto) => (
                        <div
                          key={recinto.id}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => onSeleccionarRecinto?.(recinto)}
                        >
                          <Box className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate">{recinto.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {TIPOS_RECINTO[recinto.type] || recinto.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
