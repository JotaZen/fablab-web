"use client";

import { useEffect, useState, useCallback } from 'react';
import { 
  Ruler, 
  RefreshCw, 
  Search,
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
import { getUoMClient } from '@/features/inventory/infrastructure/vessel/uom.client';
import type { UnidadMedida, CategoriaUoM } from '@/features/inventory/domain/entities/uom';

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

export function UnidadesMedidaSettings() {
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaUoM | 'all'>('all');

  // Conversión
  const [conversionFrom, setConversionFrom] = useState('');
  const [conversionTo, setConversionTo] = useState('');
  const [conversionValue, setConversionValue] = useState('1');
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const cargarUnidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getUoMClient();
      const data = await client.listar();
      setUnidades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar unidades');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUnidades();
  }, [cargarUnidades]);

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

  // Filtrar unidades
  const unidadesFiltradas = unidades.filter(u => {
    const matchBusqueda = !busqueda || 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.simbolo.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchCategoria = categoriaFiltro === 'all' || u.categoria === categoriaFiltro;
    
    return matchBusqueda && matchCategoria;
  });

  // Agrupar por categoría
  const categorias = Array.from(new Set(unidades.map(u => u.categoria)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
        <button 
          onClick={cargarUnidades}
          className="mt-2 text-sm text-destructive underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Unidades de Medida</h2>
          <p className="text-sm text-muted-foreground">
            {unidades.length} unidades disponibles
          </p>
        </div>
        <button
          onClick={cargarUnidades}
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {/* Convertidor */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
          <ArrowRightLeft className="h-4 w-4" />
          Convertidor
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
              {unidades.map(u => (
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
              {unidades.map(u => (
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

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar unidad..."
            className="w-full rounded-md border bg-background pl-9 pr-3 py-1.5 text-sm"
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value as CategoriaUoM | 'all')}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{categoryLabels[cat]}</option>
          ))}
        </select>
      </div>

      {/* Lista de unidades */}
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Código</th>
              <th className="px-4 py-2 font-medium">Nombre</th>
              <th className="px-4 py-2 font-medium">Símbolo</th>
              <th className="px-4 py-2 font-medium">Categoría</th>
              <th className="px-4 py-2 font-medium text-right">Factor</th>
              <th className="px-4 py-2 font-medium text-center">Base</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {unidadesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No se encontraron unidades
                </td>
              </tr>
            ) : (
              unidadesFiltradas.map(unidad => {
                const Icon = categoryIcons[unidad.categoria];
                return (
                  <tr key={unidad.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {unidad.codigo}
                      </code>
                    </td>
                    <td className="px-4 py-2 text-sm">{unidad.nombre}</td>
                    <td className="px-4 py-2 text-sm font-medium">{unidad.simbolo}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        {categoryLabels[unidad.categoria]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-mono">
                      {unidad.factorConversion}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {unidad.esBase && (
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
