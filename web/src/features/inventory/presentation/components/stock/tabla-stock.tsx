/**
 * Tabla de Stock
 * 
 * Muestra el inventario estilo Excel: Código, Artículo, Entradas, Salidas, Stock, Observaciones
 */

"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Badge } from '@/shared/ui/badges/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/tables/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/misc/dialog';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import { 
  Search, 
  ArrowUpCircle,
  ArrowDownCircle,
  Package,
  Loader2,
  RefreshCw
} from 'lucide-react';
import type { ItemStock } from '../../../domain/entities';

interface TablaStockProps {
  items: ItemStock[];
  cargando: boolean;
  onEntrada: (id: string, cantidad: number, razon?: string) => Promise<void>;
  onSalida: (id: string, cantidad: number, razon?: string) => Promise<void>;
  onRefrescar: () => void;
}

type TipoMovimiento = 'entrada' | 'salida';

interface DialogMovimiento {
  abierto: boolean;
  tipo: TipoMovimiento;
  item: ItemStock | null;
}

export function TablaStock({
  items,
  cargando,
  onEntrada,
  onSalida,
  onRefrescar,
}: TablaStockProps) {
  const [busqueda, setBusqueda] = useState('');
  const [dialogMovimiento, setDialogMovimiento] = useState<DialogMovimiento>({
    abierto: false,
    tipo: 'entrada',
    item: null,
  });
  const [cantidad, setCantidad] = useState('');
  const [razon, setRazon] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Filtrar items por búsqueda
  const itemsFiltrados = items.filter(item =>
    item.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.meta?.nombre as string || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirDialogMovimiento = (tipo: TipoMovimiento, item: ItemStock) => {
    setDialogMovimiento({ abierto: true, tipo, item });
    setCantidad('');
    setRazon('');
  };

  const cerrarDialog = () => {
    setDialogMovimiento({ abierto: false, tipo: 'entrada', item: null });
    setCantidad('');
    setRazon('');
  };

  const handleMovimiento = async () => {
    if (!dialogMovimiento.item || !cantidad) return;
    
    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) return;

    setGuardando(true);
    try {
      if (dialogMovimiento.tipo === 'entrada') {
        await onEntrada(dialogMovimiento.item.id, cantidadNum, razon || undefined);
      } else {
        await onSalida(dialogMovimiento.item.id, cantidadNum, razon || undefined);
      }
      cerrarDialog();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button variant="outline" onClick={onRefrescar} disabled={cargando}>
          <RefreshCw className={`h-4 w-4 mr-2 ${cargando ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Tabla estilo Excel */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-600 hover:bg-orange-600">
              <TableHead className="text-white font-semibold w-[100px]">Código</TableHead>
              <TableHead className="text-white font-semibold">Artículo</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Entradas</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Salidas</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Stock</TableHead>
              <TableHead className="text-white font-semibold">Observaciones</TableHead>
              <TableHead className="text-white font-semibold w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : itemsFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {busqueda ? 'No se encontraron resultados' : 'No hay items en stock'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              itemsFiltrados.map((item, index) => {
                // Calcular entradas/salidas si hay metadata
                const entradas = (item.meta?.entradas as number) || item.cantidad;
                const salidas = (item.meta?.salidas as number) || 0;
                const nombre = (item.meta?.nombre as string) || item.sku;
                const observaciones = (item.meta?.observaciones as string) || item.numeroLote || '';

                return (
                  <TableRow 
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {item.sku}
                    </TableCell>
                    <TableCell>{nombre}</TableCell>
                    <TableCell className="text-center text-green-600 font-medium">
                      {entradas}
                    </TableCell>
                    <TableCell className="text-center text-red-600 font-medium">
                      {salidas || ''}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      <Badge 
                        variant={item.cantidadDisponible > 0 ? 'default' : 'destructive'}
                        className="min-w-[40px]"
                      >
                        {item.cantidadDisponible}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {observaciones}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => abrirDialogMovimiento('entrada', item)}
                          title="Registrar entrada"
                        >
                          <ArrowUpCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => abrirDialogMovimiento('salida', item)}
                          title="Registrar salida"
                        >
                          <ArrowDownCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total */}
      {!cargando && itemsFiltrados.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {itemsFiltrados.length} item{itemsFiltrados.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Dialog de movimiento */}
      <Dialog open={dialogMovimiento.abierto} onOpenChange={(open) => !open && cerrarDialog()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialogMovimiento.tipo === 'entrada' ? (
                <>
                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                  Registrar Entrada
                </>
              ) : (
                <>
                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                  Registrar Salida
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {dialogMovimiento.item && (
                <>
                  <strong>{dialogMovimiento.item.sku}</strong> - {(dialogMovimiento.item.meta?.nombre as string) || 'Item'}
                  <br />
                  Stock actual: <strong>{dialogMovimiento.item.cantidadDisponible}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cantidad">
                Cantidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ej: 10"
                disabled={guardando}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="razon">Razón / Observación</Label>
              <Textarea
                id="razon"
                value={razon}
                onChange={(e) => setRazon(e.target.value)}
                placeholder={dialogMovimiento.tipo === 'entrada' 
                  ? 'Ej: Compra, Donación, Devolución...'
                  : 'Ej: Préstamo, Consumo, Merma...'
                }
                rows={2}
                disabled={guardando}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cerrarDialog} disabled={guardando}>
              Cancelar
            </Button>
            <Button 
              onClick={handleMovimiento} 
              disabled={guardando || !cantidad}
              className={dialogMovimiento.tipo === 'entrada' 
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {dialogMovimiento.tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
