/**
 * Tabla de Items del Catálogo
 * 
 * Muestra la lista de artículos con acciones CRUD
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/misc/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  Eye,
  Package,
  Loader2
} from 'lucide-react';
import type { Item, EstadoItem } from '../../../domain/entities';
import { ESTADO_ITEM_LABELS } from '../../../domain/entities';

interface TablaItemsProps {
  items: Item[];
  cargando: boolean;
  onBuscar: (termino: string) => void;
  onCrear: () => void;
  onEditar: (item: Item) => void;
  onEliminar: (item: Item) => void;
  onVerStock?: (item: Item) => void;
}

const BADGE_VARIANTS: Record<EstadoItem, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  archived: 'outline',
};

export function TablaItems({
  items,
  cargando,
  onBuscar,
  onCrear,
  onEditar,
  onEliminar,
  onVerStock,
}: TablaItemsProps) {
  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(busqueda);
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y acciones */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleBuscar} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artículos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </form>
        
        <Button onClick={onCrear}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Artículo</TableHead>
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
              <TableHead className="w-[100px]">Estado</TableHead>
              <TableHead className="w-[80px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground">No hay artículos</span>
                    <Button variant="outline" size="sm" onClick={onCrear}>
                      Crear primer artículo
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">
                    {item.codigo}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.nombre}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {item.descripcion || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={BADGE_VARIANTS[item.estado]}>
                      {ESTADO_ITEM_LABELS[item.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onVerStock && (
                          <DropdownMenuItem onClick={() => onVerStock(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Stock
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEditar(item)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEliminar(item)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info de resultados */}
      {!cargando && items.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {items.length} artículo{items.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
