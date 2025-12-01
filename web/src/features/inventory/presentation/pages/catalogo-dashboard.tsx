"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { Package, Tags, FolderTree, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { useTaxonomy } from '../hooks/use-taxonomy';
import { VocabulariosList } from '../components/vocabularios';
import { TerminosList } from '../components/terminos';
import type { Vocabulario } from '../../domain/entities/taxonomy';

export function CatalogoDashboard() {
  const {
    vocabularios,
    terminos,
    cargando,
    error,
    cargarVocabularios,
    cargarTerminos,
    crearVocabulario,
    crearTermino,
    eliminarVocabulario,
    eliminarTermino,
    limpiarError,
  } = useTaxonomy();

  const [vocabularioSeleccionado, setVocabularioSeleccionado] = useState<Vocabulario | null>(null);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  // Cargar vocabularios al montar
  useEffect(() => {
    cargarVocabularios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar términos cuando se selecciona un vocabulario
  useEffect(() => {
    if (vocabularioSeleccionado) {
      cargarTerminos({ vocabularioId: vocabularioSeleccionado.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabularioSeleccionado?.id]);

  const handleSelectVocabulario = (vocab: Vocabulario) => {
    setVocabularioSeleccionado(vocab);
  };

  const handleVolver = () => {
    setVocabularioSeleccionado(null);
  };

  const handleCrearVocabulario = async (nombre: string, descripcion?: string) => {
    await crearVocabulario({ nombre, descripcion });
  };

  const handleCrearTermino = async (nombre: string, vocabularioId: string, descripcion?: string, padreId?: string) => {
    await crearTermino({ nombre, vocabularioId, descripcion, padreId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona vocabularios y términos para clasificar items del FabLab
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarConfig(!mostrarConfig)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              cargarVocabularios();
              if (vocabularioSeleccionado) {
                cargarTerminos({ vocabularioId: vocabularioSeleccionado.id });
              }
            }}
            disabled={cargando}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${cargando ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Config Panel - Conectado a Vessel API */}
      {mostrarConfig && (
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Modo:</span>
                <Badge variant="default">Vessel API</Badge>
              </div>
              <span className="text-muted-foreground text-xs">
                Conectado a {process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={limpiarError}>
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <FolderTree className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{vocabularios.length}</div>
              <div className="text-sm text-muted-foreground">Vocabularios</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Tags className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{terminos.length}</div>
              <div className="text-sm text-muted-foreground">
                Términos {vocabularioSeleccionado ? `en ${vocabularioSeleccionado.nombre}` : ''}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">—</div>
              <div className="text-sm text-muted-foreground">Items (próximamente)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vocabularios Panel */}
        <VocabulariosList
          vocabularios={vocabularios}
          cargando={cargando}
          onSelect={handleSelectVocabulario}
          onCrear={handleCrearVocabulario}
          onEliminar={eliminarVocabulario}
          vocabularioSeleccionado={vocabularioSeleccionado?.id}
        />

        {/* Términos Panel */}
        <TerminosList
          terminos={terminos}
          vocabulario={vocabularioSeleccionado || undefined}
          cargando={cargando}
          onCrear={handleCrearTermino}
          onEliminar={eliminarTermino}
          onVolver={vocabularioSeleccionado ? handleVolver : undefined}
        />
      </div>
    </div>
  );
}
