"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/misc/tabs";
import { Settings, RefreshCw, AlertCircle, FolderTree, Tag, Bookmark } from 'lucide-react';
import { useTaxonomy } from '../hooks/use-taxonomy';
import { TerminosList } from '../components/terminos';

// Configuración de vocabularios
const VOCABULARIOS_CONFIG = {
  categorias: { nombre: 'Categorías', slug: 'categorias', icon: FolderTree, singular: 'Categoría' },
  marcas: { nombre: 'Marcas', slug: 'marcas', icon: Tag, singular: 'Marca' },
  etiquetas: { nombre: 'Etiquetas', slug: 'etiquetas', icon: Bookmark, singular: 'Etiqueta' },
} as const;

type TabKey = keyof typeof VOCABULARIOS_CONFIG;

export function CatalogoDashboard() {
  const {
    terminos,
    cargando,
    error,
    cargarTerminos,
    crearTermino,
    actualizarTermino,
    eliminarTermino,
    crearVocabulario,
    limpiarError,
  } = useTaxonomy();

  const [tabActiva, setTabActiva] = useState<TabKey>('categorias');
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [inicializando, setInicializando] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref para evitar recrear la función
  const cargarTabRef = useRef<((tab: TabKey) => Promise<void>) | null>(null);

  // Función para cargar - guardada en ref
  cargarTabRef.current = async (tab: TabKey) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setInicializando(true);
    limpiarError();

    const config = VOCABULARIOS_CONFIG[tab];

    try {
      // UNA CONSULTA: términos por vocabulary_slug
      await cargarTerminos({ vocabularioSlug: config.slug });
    } catch (err: any) {
      // Si el vocabulario no existe, crearlo silenciosamente
      const esVocabularioNoEncontrado =
        err?.isVocabularyNotFound ||
        err?.code === 'VOCABULARY_NOT_FOUND' ||
        (err?.statusCode === 422 && err?.message?.toLowerCase()?.includes('vocabulary not found'));

      if (esVocabularioNoEncontrado) {
        try {
          // Crear vocabulario silenciosamente
          await crearVocabulario({ nombre: config.nombre, slug: config.slug });
          // Después de crear, terminos estará vacío pero eso es correcto
          // Limpiamos el error ya que lo manejamos
          limpiarError();
        } catch (createErr: any) {
          // Ignorar error si ya existe (DUPLICATE) - fallo silencioso
          const esDuplicado =
            createErr?.code === 'DUPLICATE_VOCABULARY' ||
            createErr?.message?.toLowerCase()?.includes('duplicate') ||
            createErr?.message?.toLowerCase()?.includes('already exists');

          if (!esDuplicado) {
            console.error('[Catálogo] Error creando vocabulario:', createErr);
          }
          // Limpiar error de cualquier forma - fail silently
          limpiarError();
        }
      }
      // Para otros errores, el hook ya los maneja
    } finally {
      setInicializando(false);
    }
  };

  // Cargar SOLO cuando cambia tabActiva
  useEffect(() => {
    cargarTabRef.current?.(tabActiva);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabActiva]);

  // Cleanup
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const handleTabChange = (value: string) => {
    setTabActiva(value as TabKey);
  };

  const handleRefresh = () => {
    cargarTabRef.current?.(tabActiva);
  };

  // CRUD - usar vocabulary_slug para crear
  const handleCrearTermino = async (data: any) => {
    const config = VOCABULARIOS_CONFIG[tabActiva];

    // Crear término usando vocabulary_slug (no ID)
    const termino = await crearTermino({
      ...data,
      vocabularioSlug: config.slug
    });

    // Recargar por slug
    await cargarTerminos({ vocabularioSlug: config.slug });
    return termino;
  };

  const handleActualizarTermino = async (id: string, data: any) => {
    const resultado = await actualizarTermino(id, data);
    await cargarTerminos({ vocabularioSlug: VOCABULARIOS_CONFIG[tabActiva].slug });
    return resultado;
  };

  const handleEliminarTermino = async (id: string) => {
    await eliminarTermino(id);
    await cargarTerminos({ vocabularioSlug: VOCABULARIOS_CONFIG[tabActiva].slug });
  };

  const configActivo = VOCABULARIOS_CONFIG[tabActiva];
  const IconActivo = configActivo.icon;

  // Obtener vocabularioId del primer término (si hay)
  const vocabularioId = terminos.length > 0 ? terminos[0].vocabularioId : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            Gestiona categorías, marcas y etiquetas de los items del FabLab.
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
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Modo:</span>
                <Badge variant="default">Vessel API</Badge>
              </div>
              <span className="text-muted-foreground text-xs">
                {process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000'}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline">{configActivo.slug}</Badge>
              </div>
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

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="categorias" className="gap-1.5">
            <FolderTree className="h-4 w-4" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="marcas" className="gap-1.5">
            <Tag className="h-4 w-4" />
            Marcas
          </TabsTrigger>
          <TabsTrigger value="etiquetas" className="gap-1.5">
            <Bookmark className="h-4 w-4" />
            Etiquetas
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tabActiva} className="space-y-4">
          {inicializando ? (
            <Card className="min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Cargando {configActivo.nombre.toLowerCase()}...</p>
              </div>
            </Card>
          ) : (
            <TerminosList
              terminos={terminos}
              vocabulario={{
                id: vocabularioId,
                nombre: configActivo.nombre,
                slug: configActivo.slug
              }}
              tipoLabel={configActivo.singular}
              cargando={cargando}
              onCrear={handleCrearTermino}
              onActualizar={handleActualizarTermino}
              onEliminar={handleEliminarTermino}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
