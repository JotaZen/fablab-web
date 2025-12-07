"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/misc/tabs";
import { Settings, RefreshCw, AlertCircle, FolderTree } from 'lucide-react';
import { useTaxonomy } from '../hooks/use-taxonomy';
import { TerminosList } from '../components/terminos';
import type { Vocabulario } from '../../domain/entities/taxonomy';

export function CatalogoDashboard() {
  const {
    terminos,
    cargando,
    error,
    obtenerOCrearVocabulario,
    cargarTerminos,
    crearTermino,
    actualizarTermino,
    eliminarTermino,
    limpiarError,
  } = useTaxonomy();

  const [vocabulario, setVocabulario] = useState<Vocabulario | null>(null);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [inicializando, setInicializando] = useState(true);

  // Inicializar Vocabulario por defecto "Categorías"
  useEffect(() => {
    const init = async () => {
      try {
        const v = await obtenerOCrearVocabulario('Categorías');
        setVocabulario(v);
        await cargarTerminos({ vocabularioId: v.id });
      } catch (e) {
        console.error("Error inicializando catálogo:", e);
      } finally {
        setInicializando(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    if (vocabulario) {
      await cargarTerminos({ vocabularioId: vocabulario.id });
    } else {
      // Reintentar inicialización
      setInicializando(true);
      try {
        const v = await obtenerOCrearVocabulario('Categorías');
        setVocabulario(v);
        await cargarTerminos({ vocabularioId: v.id });
      } finally {
        setInicializando(false);
      }
    }
  };

  const handleCrearTermino = async (data: any) => {
    if (!vocabulario) return Promise.reject("No hay vocabulario");
    return await crearTermino({ ...data, vocabularioId: vocabulario.id });
  };

  const handleActualizarTermino = async (id: string, data: any) => {
    return await actualizarTermino(id, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            Gestiona las categorías y clasificaciones de los items del FabLab.
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
            onClick={handleRefresh}
            disabled={cargando || inicializando}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${cargando || inicializando ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Config Panel */}
      {mostrarConfig && (
        <Card className="border-dashed mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Modo:</span>
                <Badge variant="default">Vessel API</Badge>
              </div>
              <span className="text-muted-foreground text-xs">
                Conectado a {process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000'}
              </span>
              {vocabulario && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-muted-foreground">Vocabulario Activo:</span>
                  <Badge variant="outline">{vocabulario.nombre} (ID: {vocabulario.id})</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10 mb-6">
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

      {/* Main Content with Tabs */}
      <Tabs defaultValue="categorias" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="marcas" disabled title="Próximamente">Marcas</TabsTrigger>
          <TabsTrigger value="etiquetas" disabled title="Próximamente">Etiquetas</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-4">
          {inicializando ? (
            <Card className="min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Inicializando catálogo...</p>
              </div>
            </Card>
          ) : !vocabulario ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                <FolderTree className="h-10 w-10 text-muted-foreground opacity-50" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">No se encontró el catálogo</h3>
                  <p className="text-muted-foreground">Hubo un problema al cargar el vocabulario de categorías.</p>
                </div>
                <Button onClick={handleRefresh}>Intentar nuevamente</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <TerminosList
                terminos={terminos}
                vocabulario={vocabulario}
                cargando={cargando}
                onCrear={handleCrearTermino}
                onActualizar={handleActualizarTermino}
                onEliminar={eliminarTermino}
              // onVolver ya no es necesario en vista de árbol completa
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
