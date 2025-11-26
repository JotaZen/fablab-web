/**
 * Dashboard de Sedes y Recintos
 * 
 * Gestión de ubicaciones físicas del FabLab
 */

"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { 
  Building2, 
  Box, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { ListaSedes, ListaRecintos } from '../components/locations';
import type { 
  Location, 
  Venue, 
  CreateLocationDTO, 
  CreateVenueDTO 
} from '../../domain/entities';
import { getLocationClient } from '../../infrastructure/api/location-client';

type EstadoConexion = 'verificando' | 'conectado' | 'desconectado' | 'error';

interface EstadoApi {
  estado: EstadoConexion;
  mensaje: string;
  latencia?: number;
  cantidadSedes?: number;
  cantidadRecintos?: number;
}

export function SedesRecintosDashboard() {
  const [estadoApi, setEstadoApi] = useState<EstadoApi>({
    estado: 'verificando',
    mensaje: 'Verificando conexión...',
  });

  const [sedes, setSedes] = useState<Location[]>([]);
  const [recintos, setRecintos] = useState<Venue[]>([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<Location | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cliente = getLocationClient();

  const verificarConexion = useCallback(async () => {
    setEstadoApi({ estado: 'verificando', mensaje: 'Verificando conexión...' });
    
    const tiempoInicio = Date.now();
    
    try {
      const sedesObtenidas = await cliente.getLocations();
      const latencia = Date.now() - tiempoInicio;
      
      setSedes(sedesObtenidas);
      
      // Obtener todos los recintos
      const recintosObtenidos = await cliente.getVenues();
      setRecintos(recintosObtenidos);
      
      setEstadoApi({
        estado: 'conectado',
        mensaje: 'Conectado a Vessel API',
        latencia,
        cantidadSedes: sedesObtenidas.length,
        cantidadRecintos: recintosObtenidos.length,
      });
    } catch (err) {
      setEstadoApi({
        estado: 'desconectado',
        mensaje: err instanceof Error ? err.message : 'No se pudo conectar',
      });
    }
  }, [cliente]);

  useEffect(() => {
    verificarConexion();
  }, [verificarConexion]);

  // ============================================================
  // MANEJADORES
  // ============================================================

  const handleSeleccionarSede = useCallback(async (sede: Location) => {
    setSedeSeleccionada(sede);
    setCargando(true);
    try {
      const recintosDeSede = await cliente.getVenuesByLocation(sede.id);
      setRecintos(prev => {
        // Reemplazar recintos de esta sede
        const otrosRecintos = prev.filter(r => r.locationId !== sede.id);
        return [...otrosRecintos, ...recintosDeSede];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recintos');
    } finally {
      setCargando(false);
    }
  }, [cliente]);

  const handleCrearSede = useCallback(async (data: CreateLocationDTO) => {
    try {
      const nuevaSede = await cliente.createLocation(data);
      setSedes(prev => [...prev, nuevaSede]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear sede');
      throw err;
    }
  }, [cliente]);

  const handleEliminarSede = useCallback(async (id: string) => {
    try {
      await cliente.deleteLocation(id);
      setSedes(prev => prev.filter(s => s.id !== id));
      setRecintos(prev => prev.filter(r => r.locationId !== id));
      if (sedeSeleccionada?.id === id) {
        setSedeSeleccionada(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar sede');
    }
  }, [cliente, sedeSeleccionada]);

  const handleCrearRecinto = useCallback(async (data: CreateVenueDTO) => {
    try {
      const nuevoRecinto = await cliente.createVenue(data);
      setRecintos(prev => [...prev, nuevoRecinto]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear recinto');
      throw err;
    }
  }, [cliente]);

  const handleEliminarRecinto = useCallback(async (id: string) => {
    try {
      await cliente.deleteVenue(id);
      setRecintos(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar recinto');
    }
  }, [cliente]);

  const handleSeleccionarRecinto = useCallback((recinto: Venue) => {
    // Encontrar la sede de este recinto
    const sede = sedes.find(s => s.id === recinto.locationId);
    if (sede) {
      setSedeSeleccionada(sede);
    }
  }, [sedes]);

  // ============================================================
  // UI DE ESTADO
  // ============================================================

  const obtenerIconoEstado = () => {
    switch (estadoApi.estado) {
      case 'verificando':
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
      case 'conectado':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'desconectado':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const obtenerBadgeEstado = () => {
    switch (estadoApi.estado) {
      case 'verificando':
        return <Badge variant="outline">Verificando...</Badge>;
      case 'conectado':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'desconectado':
        return <Badge variant="destructive">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-yellow-100 text-yellow-800">Error</Badge>;
    }
  };

  // Recintos de la sede seleccionada
  const recintosSedeSeleccionada = sedeSeleccionada 
    ? recintos.filter(r => r.locationId === sedeSeleccionada.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sedes y Recintos</h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones físicas del FabLab
          </p>
        </div>
        <Button onClick={verificarConexion} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Alerta de Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
            >
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tarjeta de Estado */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            {obtenerIconoEstado()}
            <div className="flex-1">
              <CardTitle className="text-base">Vessel API</CardTitle>
              <CardDescription>{estadoApi.mensaje}</CardDescription>
            </div>
            {obtenerBadgeEstado()}
          </div>
        </CardHeader>
        {estadoApi.estado === 'conectado' && (
          <CardContent>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{estadoApi.cantidadSedes}</span>
                <span className="text-muted-foreground">sedes</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{estadoApi.cantidadRecintos}</span>
                <span className="text-muted-foreground">recintos</span>
              </div>
              {estadoApi.latencia && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Latencia: {estadoApi.latencia}ms</span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Contenido Principal */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista de Sedes */}
        <ListaSedes
          sedes={sedes}
          recintos={recintos}
          cargando={cargando}
          onSeleccionar={handleSeleccionarSede}
          onCrear={handleCrearSede}
          onEliminar={handleEliminarSede}
          sedeSeleccionadaId={sedeSeleccionada?.id}
          onSeleccionarRecinto={handleSeleccionarRecinto}
        />

        {/* Lista de Recintos */}
        <ListaRecintos
          recintos={recintosSedeSeleccionada}
          cargando={cargando}
          sedeId={sedeSeleccionada?.id}
          nombreSede={sedeSeleccionada?.name}
          onSeleccionar={(recinto: Venue) => console.log('Recinto seleccionado:', recinto)}
          onCrear={handleCrearRecinto}
          onEliminar={handleEliminarRecinto}
        />
      </div>

      {/* Resumen Rápido */}
      {estadoApi.estado === 'conectado' && sedes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {sedes.map((sede) => {
                const recintosDeSede = recintos.filter(r => r.locationId === sede.id);
                return (
                  <div
                    key={sede.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{sede.name}</div>
                      {sede.address && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{sede.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Box className="h-3 w-3" />
                        <span>{recintosDeSede.length} recintos</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Alias para compatibilidad
export { SedesRecintosDashboard as LocationsDashboard };
