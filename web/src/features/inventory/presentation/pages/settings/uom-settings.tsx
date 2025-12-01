"use client";

import { useState, useCallback } from 'react';
import { 
  Ruler, 
  ArrowRightLeft,
  Scale,
  Box,
  Clock,
  Droplet,
  Hash,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { DataTable, type ColumnDef, type FetchResult } from '@/shared/ui/tables/data-table';
import { getUoMClient } from '@/features/inventory/infrastructure/vessel/uom.client';
import type { UnidadMedida } from '@/features/inventory/domain/entities/uom';

// Iconos por categoría
const categoryIcons: Record<string, LucideIcon> = {
  length: Ruler,
  weight: Scale,
  volume: Droplet,
  area: Box,
  time: Clock,
  quantity: Hash,
  other: MoreHorizontal,
};

// Labels en español
const categoryLabels: Record<string, string> = {
  length: 'Longitud',
  weight: 'Peso',
  volume: 'Volumen',
  area: 'Área',
  time: 'Tiempo',
  quantity: 'Cantidad',
  other: 'Otros',
};

// Columnas de la tabla
const columns: ColumnDef<UnidadMedida>[] = [
  {
    id: 'codigo',
    header: 'Código',
    accessor: (row) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
        {row.codigo}
      </code>
    ),
    sortable: true,
  },
  {
    id: 'nombre',
    header: 'Nombre',
    accessor: 'nombre',
    sortable: true,
  },
  {
    id: 'simbolo',
    header: 'Símbolo',
    accessor: 'simbolo',
    className: 'font-medium',
  },
  {
    id: 'categoria',
    header: 'Categoría',
    accessor: (row) => {
      const Icon = categoryIcons[row.categoria] || MoreHorizontal;
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {categoryLabels[row.categoria] || row.categoria}
        </span>
      );
    },
    sortable: true,
  },
  {
    id: 'factorConversion',
    header: 'Factor',
    accessor: 'factorConversion',
    className: 'text-right font-mono',
    headerClassName: 'text-right',
  },
  {
    id: 'esBase',
    header: 'Base',
    accessor: (row) => row.esBase ? (
      <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
    ) : null,
    className: 'text-center',
    headerClassName: 'text-center',
  },
];

export function UnidadesMedidaSettings() {
  // Conversión
  const [unidadesParaConversion, setUnidadesParaConversion] = useState<UnidadMedida[]>([]);
  const [conversionFrom, setConversionFrom] = useState('');
  const [conversionTo, setConversionTo] = useState('');
  const [conversionValue, setConversionValue] = useState('1');
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  // Fetcher para la tabla
  const fetchUnidades = useCallback(async (): Promise<FetchResult<UnidadMedida>> => {
    const client = getUoMClient();
    const data = await client.listar();
    
    // Guardar para el convertidor
    setUnidadesParaConversion(data);
    
    return {
      data,
      total: data.length,
    };
  }, []);

  const convertir = async () => {
    if (!conversionFrom || !conversionTo || !conversionValue) return;
    
    setConverting(true);
    setConversionResult(null);
    try {
      const client = getUoMClient();
      const result = await client.convertir({
        desde: conversionFrom,
        hasta: conversionTo,
        valor: parseFloat(conversionValue),
      });
      setConversionResult(`${result.valorOriginal} ${result.unidadOrigen} = ${result.valorConvertido.toFixed(4)} ${result.unidadDestino}`);
    } catch (err) {
      setConversionResult(`Error: ${err instanceof Error ? err.message : 'Error de conversión'}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Convertidor */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
          <ArrowRightLeft className="h-4 w-4" />
          Convertidor de Unidades
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[100px]">
            <label className="text-xs text-muted-foreground">Valor</label>
            <input
              type="number"
              value={conversionValue}
              onChange={(e) => setConversionValue(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
              placeholder="1"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="text-xs text-muted-foreground">De</label>
            <select
              value={conversionFrom}
              onChange={(e) => setConversionFrom(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              <option value="">Seleccionar...</option>
              {unidadesParaConversion.map(u => (
                <option key={u.id} value={u.codigo}>
                  {u.nombre} ({u.simbolo})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="text-xs text-muted-foreground">A</label>
            <select
              value={conversionTo}
              onChange={(e) => setConversionTo(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              <option value="">Seleccionar...</option>
              {unidadesParaConversion.map(u => (
                <option key={u.id} value={u.codigo}>
                  {u.nombre} ({u.simbolo})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={convertir}
            disabled={converting || !conversionFrom || !conversionTo}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {converting ? 'Convirtiendo...' : 'Convertir'}
          </button>
        </div>
        {conversionResult && (
          <p className={cn(
            "mt-3 text-sm font-medium",
            conversionResult.startsWith('Error') ? 'text-destructive' : 'text-green-600'
          )}>
            {conversionResult}
          </p>
        )}
      </div>

      {/* Tabla de unidades */}
      <DataTable<UnidadMedida>
        columns={columns}
        fetcher={fetchUnidades}
        pagination={{ pageSize: 10, fetchSize: 50 }}
        searchable={true}
        searchPlaceholder="Buscar unidad..."
        emptyMessage="No se encontraron unidades de medida"
        getRowId={(row) => row.id}
      />

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          Unidad base de la categoría
        </span>
        <span>
          Factor: multiplicador para convertir a unidad base
        </span>
      </div>
    </div>
  );
}
