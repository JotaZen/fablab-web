/**
 * Dashboard de Artículos
 * 
 * Página principal para gestionar artículos del inventario
 * Similar al Excel: Código, Artículo, Entradas, Salidas, Stock
 */

"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/misc/alert-dialog';
import { 
  Package, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { TablaItems, FormularioItemCompleto } from '../components/items';
import { useItems } from '../hooks/use-items';
import type { Item, CrearItemDTO } from '../../domain/entities';

type EstadoConexion = 'verificando' | 'conectado' | 'desconectado' | 'error';

export function ArticulosDashboard() {
  const {
    items,
    total,
    cargando,
    error,
    crear,
    actualizar,
    eliminar,
    buscar,
    refrescar,
  } = useItems();

  // Estado de conexión
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>(
    error ? 'error' : cargando ? 'verificando' : 'conectado'
  );

  // Estado del formulario
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState<Item | null>(null);

  // Estado de confirmación de eliminación
  const [itemEliminar, setItemEliminar] = useState<Item | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Handlers
  const handleCrear = () => {
    setItemEditando(null);
    setFormularioAbierto(true);
  };

  const handleEditar = (item: Item) => {
    setItemEditando(item);
    setFormularioAbierto(true);
  };

  const handleGuardar = async (data: CrearItemDTO) => {
    if (itemEditando) {
      await actualizar(itemEditando.id, data);
    } else {
      await crear(data);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!itemEliminar) return;
    
    setEliminando(true);
    try {
      await eliminar(itemEliminar.id);
      setItemEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const handleRefrescar = async () => {
    setEstadoConexion('verificando');
    try {
      await refrescar();
      setEstadoConexion('conectado');
    } catch {
      setEstadoConexion('error');
    }
  };

  // Icono de estado
  const IconoEstado = {
    verificando: RefreshCw,
    conectado: CheckCircle2,
    desconectado: XCircle,
    error: AlertTriangle,
  }[estadoConexion];

  const colorEstado = {
    verificando: 'text-yellow-500',
    conectado: 'text-green-500',
    desconectado: 'text-red-500',
    error: 'text-red-500',
  }[estadoConexion];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Artículos
          </h1>
          <p className="text-muted-foreground">
            Gestiona los artículos del inventario
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Estado de conexión */}
          <div className="flex items-center gap-2 text-sm">
            <IconoEstado className={`h-4 w-4 ${colorEstado} ${estadoConexion === 'verificando' ? 'animate-spin' : ''}`} />
            <span className="text-muted-foreground">
              {estadoConexion === 'verificando' && 'Conectando...'}
              {estadoConexion === 'conectado' && 'Vessel API'}
              {estadoConexion === 'error' && 'Sin conexión'}
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={handleRefrescar}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Artículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {items.filter(i => i.estado === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Borradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {items.filter(i => i.estado === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de items */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Artículos</CardTitle>
          <CardDescription>
            Todos los artículos del catálogo de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TablaItems
            items={items}
            cargando={cargando}
            onBuscar={buscar}
            onCrear={handleCrear}
            onEditar={handleEditar}
            onEliminar={setItemEliminar}
          />
        </CardContent>
      </Card>

      {/* Formulario de crear/editar */}
      <FormularioItemCompleto
        item={itemEditando}
        abierto={formularioAbierto}
        onCerrar={() => setFormularioAbierto(false)}
        onGuardar={handleGuardar}
        cargando={cargando}
      />

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!itemEliminar} onOpenChange={(open: boolean) => !open && setItemEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el artículo{' '}
              <strong>{itemEliminar?.nombre}</strong> del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarEliminar}
              disabled={eliminando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
