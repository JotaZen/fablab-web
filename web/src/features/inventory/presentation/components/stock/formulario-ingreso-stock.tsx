/**
 * Formulario de Ingreso de Stock
 * 
 * Permite ingresar un item del catálogo al inventario con cantidad inicial
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Textarea } from '@/shared/ui/inputs/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/inputs/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/misc/dialog';
import { Loader2, Package, MapPin, Hash } from 'lucide-react';
import type { Item } from '../../../domain/entities/item';
import type { CrearItemStockDTO, TipoUbicacionStock } from '../../../domain/entities/stock';
import type { Locacion } from '../../../domain/entities/location';

interface FormularioIngresoStockProps {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (data: CrearItemStockDTO) => Promise<void>;
  itemsCatalogo: Item[];
  ubicaciones: Locacion[];
  cargandoItems?: boolean;
  cargandoUbicaciones?: boolean;
}

const TIPOS_UBICACION: { value: TipoUbicacionStock; label: string }[] = [
  { value: 'warehouse', label: 'Bodega' },
  { value: 'store', label: 'Tienda' },
  { value: 'office', label: 'Oficina' },
  { value: 'distribution_center', label: 'Centro de Distribución' },
];

export function FormularioIngresoStock({
  abierto,
  onCerrar,
  onGuardar,
  itemsCatalogo,
  ubicaciones,
  cargandoItems = false,
  cargandoUbicaciones = false,
}: FormularioIngresoStockProps) {
  // Estado del formulario
  const [catalogoItemId, setCatalogoItemId] = useState('');
  const [ubicacionId, setUbicacionId] = useState('');
  const [tipoUbicacion, setTipoUbicacion] = useState<TipoUbicacionStock>('warehouse');
  const [cantidad, setCantidad] = useState('');
  const [sku, setSku] = useState('');
  const [numeroLote, setNumeroLote] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Auto-generar SKU cuando se selecciona un item
  useEffect(() => {
    if (catalogoItemId) {
      const item = itemsCatalogo.find(i => i.id === catalogoItemId);
      if (item) {
        // Usar el código del item o generar uno basado en el nombre
        setSku(item.codigo || `${item.nombre.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`);
      }
    }
  }, [catalogoItemId, itemsCatalogo]);

  const resetFormulario = () => {
    setCatalogoItemId('');
    setUbicacionId('');
    setTipoUbicacion('warehouse');
    setCantidad('');
    setSku('');
    setNumeroLote('');
    setFechaExpiracion('');
    setNumeroSerie('');
    setObservaciones('');
  };

  const handleCerrar = () => {
    resetFormulario();
    onCerrar();
  };

  const handleGuardar = async () => {
    if (!catalogoItemId || !ubicacionId || !cantidad || !sku) return;

    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) return;

    setGuardando(true);
    try {
      const item = itemsCatalogo.find(i => i.id === catalogoItemId);
      
      await onGuardar({
        sku,
        catalogoItemId,
        catalogoOrigen: 'internal_catalog',
        ubicacionId,
        tipoUbicacion,
        cantidad: cantidadNum,
        numeroLote: numeroLote || undefined,
        fechaExpiracion: fechaExpiracion || undefined,
        numeroSerie: numeroSerie || undefined,
        meta: {
          nombre: item?.nombre,
          observaciones: observaciones || undefined,
        },
      });
      handleCerrar();
    } finally {
      setGuardando(false);
    }
  };

  const itemSeleccionado = itemsCatalogo.find(i => i.id === catalogoItemId);
  const formValido = catalogoItemId && ubicacionId && cantidad && sku && parseInt(cantidad, 10) > 0;

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && handleCerrar()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Ingresar Item al Inventario
          </DialogTitle>
          <DialogDescription>
            Selecciona un producto del catálogo y registra su ingreso al stock
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Selección de Item del Catálogo */}
          <div className="grid gap-2">
            <Label htmlFor="catalogoItem">
              Producto del Catálogo <span className="text-destructive">*</span>
            </Label>
            <Select
              value={catalogoItemId}
              onValueChange={setCatalogoItemId}
              disabled={guardando || cargandoItems}
            >
              <SelectTrigger>
                <SelectValue placeholder={cargandoItems ? "Cargando productos..." : "Seleccionar producto"} />
              </SelectTrigger>
              <SelectContent>
                {itemsCatalogo.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <span className="font-mono text-xs text-muted-foreground mr-2">
                      {item.codigo || '---'}
                    </span>
                    {item.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {itemSeleccionado?.descripcion && (
              <p className="text-xs text-muted-foreground">{itemSeleccionado.descripcion}</p>
            )}
          </div>

          {/* SKU */}
          <div className="grid gap-2">
            <Label htmlFor="sku">
              <Hash className="inline h-3 w-3 mr-1" />
              SKU <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="Código SKU único"
              disabled={guardando}
            />
            <p className="text-xs text-muted-foreground">
              Se genera automáticamente, pero puedes personalizarlo
            </p>
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>
                <MapPin className="inline h-3 w-3 mr-1" />
                Ubicación <span className="text-destructive">*</span>
              </Label>
              <Select
                value={ubicacionId}
                onValueChange={setUbicacionId}
                disabled={guardando || cargandoUbicaciones}
              >
                <SelectTrigger>
                  <SelectValue placeholder={cargandoUbicaciones ? "Cargando..." : "Seleccionar"} />
                </SelectTrigger>
                <SelectContent>
                  {ubicaciones.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Tipo de Ubicación</Label>
              <Select
                value={tipoUbicacion}
                onValueChange={(v: string) => setTipoUbicacion(v as TipoUbicacionStock)}
                disabled={guardando}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_UBICACION.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cantidad */}
          <div className="grid gap-2">
            <Label htmlFor="cantidad">
              Cantidad Inicial <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej: 100"
              disabled={guardando}
            />
          </div>

          {/* Campos opcionales - Lote y Expiración */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lote">Número de Lote</Label>
              <Input
                id="lote"
                value={numeroLote}
                onChange={(e) => setNumeroLote(e.target.value)}
                placeholder="Ej: LOT-2024-001"
                disabled={guardando}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiracion">Fecha Expiración</Label>
              <Input
                id="expiracion"
                type="date"
                value={fechaExpiracion}
                onChange={(e) => setFechaExpiracion(e.target.value)}
                disabled={guardando}
              />
            </div>
          </div>

          {/* Número de Serie (opcional) */}
          <div className="grid gap-2">
            <Label htmlFor="serie">Número de Serie</Label>
            <Input
              id="serie"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              placeholder="Para productos con serie única"
              disabled={guardando}
            />
          </div>

          {/* Observaciones */}
          <div className="grid gap-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas adicionales sobre este ingreso..."
              rows={2}
              disabled={guardando}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCerrar} disabled={guardando}>
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={guardando || !formValido}>
            {guardando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Ingresar al Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
