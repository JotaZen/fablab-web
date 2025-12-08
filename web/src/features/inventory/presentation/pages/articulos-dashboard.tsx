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
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftRight,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/ui/misc/dropdown-menu';
import { TablaItems, FormularioItemCompleto, DetalleItemModal } from '../components/items';
import { FormularioMovimiento } from '../components/movements/formulario-movimiento';
import { useItems } from '../hooks/use-items';
import type { Item, CrearItemDTO } from '../../domain/entities/item';

type EstadoConexion = 'verificando' | 'conectado' | 'desconectado' | 'error';

export function ArticulosDashboard() {
  const {
    items,
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

  // Estado del formulario de items
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState<Item | null>(null);

  // Estado de detalle de item (Stock)
  const [detalleItem, setDetalleItem] = useState<Item | null>(null);

  // Estado para movimientos
  const [formularioMovimientoAbierto, setFormularioMovimientoAbierto] = useState(false);
  const [movimientoInicial, setMovimientoInicial] = useState<{
    itemId?: string;
    tipo?: 'entrada' | 'salida' | 'transferencia';
  }>({});

  // Estado para flujo de creación -> stock
  const [itemRecienCreado, setItemRecienCreado] = useState<Item | null>(null);

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
    try {
      if (itemEditando) {
        await actualizar(itemEditando.id, data);
        setFormularioAbierto(false);
      } else {
        const nuevoItem = await crear(data);
        setFormularioAbierto(false);
        // Guardar referencia para ofrecer registrar stock
        setItemRecienCreado(nuevoItem);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      // El hook useItems ya maneja el error globalmente
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

  // Handler para ver stock
  const handleVerStock = (item: Item) => {
    setDetalleItem(item);
  };

  // Desde el modal de detalle, abrir formulario de movimiento
  const handleRegistrarMovimientoDesdeDetalle = (item: Item) => {
    setDetalleItem(null); // Cerrar detalle opcionalmente, o dejarlo abierto y que actualice al volver
    setMovimientoInicial({ itemId: item.id, tipo: 'entrada' });
    setFormularioMovimientoAbierto(true);
  };

  // Flujo Stock Inicial
  const handleRegistrarStockInicial = () => {
    if (itemRecienCreado) {
      setMovimientoInicial({ itemId: itemRecienCreado.id, tipo: 'entrada' });
      setFormularioMovimientoAbierto(true);
      setItemRecienCreado(null);
    }
  };

  const handleSaltarStockInicial = () => {
    setItemRecienCreado(null);
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
            Gestiona los artículos del inventario y sus existencias
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

          {/* Menú de Registrar Movimiento - Claro y descriptivo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Movimiento
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  setMovimientoInicial({ tipo: 'entrada' });
                  setFormularioMovimientoAbierto(true);
                }}
                className="cursor-pointer"
              >
                <ArrowDownCircle className="h-4 w-4 mr-2 text-green-600" />
                <div>
                  <div className="font-medium">Entrada</div>
                  <div className="text-xs text-muted-foreground">Recepción, compra, donación</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setMovimientoInicial({ tipo: 'salida' });
                  setFormularioMovimientoAbierto(true);
                }}
                className="cursor-pointer"
              >
                <ArrowUpCircle className="h-4 w-4 mr-2 text-red-600" />
                <div>
                  <div className="font-medium">Salida</div>
                  <div className="text-xs text-muted-foreground">Consumo, préstamo, baja</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setMovimientoInicial({ tipo: 'transferencia' });
                  setFormularioMovimientoAbierto(true);
                }}
                className="cursor-pointer"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-600" />
                <div>
                  <div className="font-medium">Transferencia</div>
                  <div className="text-xs text-muted-foreground">Mover entre ubicaciones</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
            onVerStock={handleVerStock}
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

      {/* Modal de Detalle (Stock) */}
      <DetalleItemModal
        item={detalleItem}
        abierto={!!detalleItem}
        onCerrar={() => setDetalleItem(null)}
        onRegistrarMovimiento={handleRegistrarMovimientoDesdeDetalle}
      />

      {/* Formulario de Movimientos */}
      <FormularioMovimiento
        abierto={formularioMovimientoAbierto}
        onCerrar={() => setFormularioMovimientoAbierto(false)}
        onExito={() => {
          handleRefrescar();
          // TODO: Mostrar toast de éxito
        }}
        itemId={movimientoInicial.itemId}
        tipoInicial={movimientoInicial.tipo}
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

      {/* Diálogo post-creación: Registrar Stock */}
      <AlertDialog open={!!itemRecienCreado} onOpenChange={(open) => !open && handleSaltarStockInicial()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Artículo Creado Exitosamente
            </AlertDialogTitle>
            <AlertDialogDescription>
              El artículo <strong>{itemRecienCreado?.nombre}</strong> ha sido agregado al catálogo.
              <br /><br />
              ¿Deseas registrar una <strong>Entrada de Stock Inicial</strong> ahora mismo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSaltarStockInicial}>
              Ahora no
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRegistrarStockInicial}>
              Registrar Stock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
