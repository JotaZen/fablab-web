"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Button } from '@/shared/ui/buttons/button';
import { 
  Package, 
  FolderTree, 
  Tags, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Activity,
  ArrowLeftRight,
  MapPin,
  FileText
} from 'lucide-react';
import Link from 'next/link';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected' | 'error';

interface VesselStatus {
  status: ConnectionStatus;
  message: string;
  latency?: number;
  vocabulariosCount?: number;
  terminosCount?: number;
}

export function InventoryDashboard() {
  const [vesselStatus, setVesselStatus] = useState<VesselStatus>({
    status: 'checking',
    message: 'Verificando conexión...',
  });

  const checkVesselConnection = async () => {
    setVesselStatus({ status: 'checking', message: 'Verificando conexión...' });
    
    const startTime = Date.now();
    const baseUrl = process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000';
    
    try {
      const res = await fetch(`${baseUrl}/api/v1/taxonomy/vocabularies/read`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const latency = Date.now() - startTime;
      
      if (res.ok) {
        const data = await res.json();
        const vocabulariosCount = data.data?.length ?? 0;
        
        // También obtener términos
        const termsRes = await fetch(`${baseUrl}/api/v1/taxonomy/terms/read`);
        let terminosCount = 0;
        if (termsRes.ok) {
          const termsData = await termsRes.json();
          terminosCount = termsData.data?.length ?? 0;
        }
        
        setVesselStatus({
          status: 'connected',
          message: 'Conectado a Vessel API',
          latency,
          vocabulariosCount,
          terminosCount,
        });
      } else {
        setVesselStatus({
          status: 'error',
          message: `Error ${res.status}: ${res.statusText}`,
          latency,
        });
      }
    } catch (error) {
      setVesselStatus({
        status: 'disconnected',
        message: error instanceof Error ? error.message : 'No se pudo conectar',
      });
    }
  };

  useEffect(() => {
    checkVesselConnection();
  }, []);

  const getStatusIcon = () => {
    switch (vesselStatus.status) {
      case 'checking':
        return <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (vesselStatus.status) {
      case 'checking':
        return <Badge variant="secondary">Verificando...</Badge>;
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600">Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">No disponible</Badge>;
      case 'error':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Error</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Sistema de gestión de inventario del FabLab
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkVesselConnection}
          disabled={vesselStatus.status === 'checking'}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${vesselStatus.status === 'checking' ? 'animate-spin' : ''}`} />
          Verificar conexión
        </Button>
      </div>

      {/* Status Card */}
      <Card className={
        vesselStatus.status === 'connected' ? 'border-green-200 bg-green-50/50' :
        vesselStatus.status === 'disconnected' ? 'border-red-200 bg-red-50/50' :
        vesselStatus.status === 'error' ? 'border-yellow-200 bg-yellow-50/50' :
        'border-blue-200 bg-blue-50/50'
      }>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                {getStatusIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Vessel API</h3>
                  {getStatusBadge()}
                </div>
                <p className="text-sm text-muted-foreground">{vesselStatus.message}</p>
                {vesselStatus.latency && (
                  <p className="text-xs text-muted-foreground">
                    Latencia: {vesselStatus.latency}ms
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-muted-foreground" />
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_VESSEL_API_URL || 'http://127.0.0.1:8000'}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vocabularios</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vesselStatus.status === 'connected' ? vesselStatus.vocabulariosCount : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              Categorías, Marcas, Estados, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Términos</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vesselStatus.status === 'connected' ? vesselStatus.terminosCount : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              Clasificaciones de productos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">
              Próximamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acceso rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Artículos */}
            <Link href="/admin/inventory/items">
              <Card className="cursor-pointer transition-all hover:bg-green-50 hover:border-green-300">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-green-100 p-3">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Artículos</h4>
                    <p className="text-sm text-muted-foreground">
                      Catálogo de productos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Stock */}
            <Link href="/admin/inventory/stock">
              <Card className="cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-300">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Stock</h4>
                    <p className="text-sm text-muted-foreground">
                      Inventario actual
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Movimientos */}
            <Link href="/admin/inventory/movimientos">
              <Card className="cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-300">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <ArrowLeftRight className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Movimientos</h4>
                    <p className="text-sm text-muted-foreground">
                      Entradas y salidas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Ubicaciones */}
            <Link href="/admin/inventory/locations">
              <Card className="cursor-pointer transition-all hover:bg-purple-50 hover:border-purple-300">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Ubicaciones</h4>
                    <p className="text-sm text-muted-foreground">
                      Sedes y recintos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Catálogo/Taxonomía */}
            <Link href="/admin/inventory/catalogo">
              <Card className="cursor-pointer transition-all hover:bg-indigo-50 hover:border-indigo-300">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-indigo-100 p-3">
                    <FolderTree className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Clasificación</h4>
                    <p className="text-sm text-muted-foreground">
                      Categorías y marcas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Kardex */}
            <Link href="/admin/inventory/kardex">
              <Card className="cursor-pointer transition-all hover:bg-amber-50 hover:border-amber-300">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-amber-100 p-3">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Kardex</h4>
                    <p className="text-sm text-muted-foreground">
                      Historial por artículo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
