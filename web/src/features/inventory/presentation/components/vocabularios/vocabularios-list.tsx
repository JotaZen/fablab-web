"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Plus, Folder, ChevronRight, Trash2, Search } from 'lucide-react';
import type { Vocabulario } from '../../../domain/entities/taxonomy';

interface VocabulariosListProps {
  vocabularios: Vocabulario[];
  cargando: boolean;
  onSelect: (vocabulario: Vocabulario) => void;
  onCrear?: (nombre: string, descripcion?: string) => Promise<void>;
  onEliminar?: (id: string) => Promise<void>;
  vocabularioSeleccionado?: string;
}

export function VocabulariosList({
  vocabularios,
  cargando,
  onSelect,
  onCrear,
  onEliminar,
  vocabularioSeleccionado,
}: VocabulariosListProps) {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [creando, setCreando] = useState(false);

  const vocabulariosFiltrados = vocabularios.filter(v =>
    v.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCrear = async () => {
    if (!nuevoNombre.trim() || !onCrear) return;
    setCreando(true);
    try {
      await onCrear(nuevoNombre.trim(), nuevaDescripcion.trim() || undefined);
      setNuevoNombre('');
      setNuevaDescripcion('');
      setMostrarFormulario(false);
    } finally {
      setCreando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Vocabularios</CardTitle>
            <CardDescription>Categorías de clasificación</CardDescription>
          </div>
          {onCrear && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Nuevo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar vocabulario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Formulario de creación */}
        {mostrarFormulario && onCrear && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <Input
              placeholder="Nombre del vocabulario"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
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

        {/* Lista de vocabularios */}
        {cargando ? (
          <div className="py-8 text-center text-muted-foreground">
            Cargando vocabularios...
          </div>
        ) : vocabulariosFiltrados.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {busqueda ? 'No se encontraron vocabularios' : 'No hay vocabularios'}
          </div>
        ) : (
          <div className="space-y-2">
            {vocabulariosFiltrados.map((vocab) => (
              <div
                key={vocab.id}
                className={`group flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer hover:bg-accent ${
                  vocabularioSeleccionado === vocab.id ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => onSelect(vocab)}
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{vocab.nombre}</div>
                    {vocab.descripcion && (
                      <div className="text-sm text-muted-foreground">
                        {vocab.descripcion}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onEliminar && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEliminar(vocab.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contador */}
        <div className="text-sm text-muted-foreground text-right">
          {vocabulariosFiltrados.length} de {vocabularios.length} vocabularios
        </div>
      </CardContent>
    </Card>
  );
}
