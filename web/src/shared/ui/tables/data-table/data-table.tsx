/**
 * DataTable - Componente Principal
 * 
 * Tabla de datos con paginación inteligente, búsqueda y ordenamiento.
 */

"use client";

import { useState, useCallback, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../table';
import { Pagination } from './pagination';
import { useDataTable } from './use-data-table';
import { DataTableProvider } from './context';
import type { DataTableProps, ColumnDef, SortState, BaseRow } from './types';

// Debounce helper
function useDebounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): T {
  const timeoutRef = { current: null as NodeJS.Timeout | null };
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]) as T;
}

export function DataTable<T extends BaseRow>({
  columns,
  fetcher,
  pagination: paginationConfig,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  getRowId,
  className,
  emptyMessage = 'No hay datos disponibles',
  rowActions,
  onRowClick,
  filters,
  deps = [],
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState('');

  const {
    state,
    pageData,
    setPage,
    setSort,
    setSearch,
    refresh,
  } = useDataTable<T>({
    fetcher,
    config: paginationConfig,
    filters,
    deps,
  });

  // Debounce search
  const debouncedSetSearch = useDebounce(setSearch, 300);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  // Handle sort
  const handleSort = useCallback((columnId: string) => {
    setSort({
      column: columnId,
      direction: state.sort.column === columnId && state.sort.direction === 'asc' ? 'desc' : 'asc',
    });
  }, [setSort, state.sort]);

  // Render cell value
  const renderCell = useCallback((row: T, column: ColumnDef<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    const value = row[column.accessor];
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    return String(value);
  }, []);

  // Get row key
  const getKey = useCallback((row: T, index: number) => {
    if (getRowId) return getRowId(row);
    if ('id' in row) return String(row.id);
    return String(index);
  }, [getRowId]);

  // Sort icon
  const SortIcon = useCallback(({ columnId }: { columnId: string }) => {
    if (state.sort.column !== columnId) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return state.sort.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  }, [state.sort]);

  // Context value
  const contextValue = useMemo(() => ({
    state,
    setPage,
    setSort,
    setSearch,
    refresh,
  }), [state, setPage, setSort, setSearch, refresh]);

  return (
    <DataTableProvider value={contextValue}>
      <div className={cn("space-y-4", className)}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={state.loading}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw className={cn("h-4 w-4", state.loading && "animate-spin")} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
            <button
              onClick={refresh}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(column.headerClassName)}
                    style={{ width: column.width }}
                  >
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.id)}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {column.header}
                        <SortIcon columnId={column.id} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
                {rowActions && <TableHead className="w-[100px]">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.loading && pageData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (rowActions ? 1 : 0)} 
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span>Cargando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : pageData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (rowActions ? 1 : 0)} 
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((row, index) => (
                  <TableRow
                    key={getKey(row, index)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      state.loading && "opacity-50"
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} className={column.className}>
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {rowActions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination
          pagination={state.pagination}
          onPageChange={setPage}
          loading={state.loading}
        />
      </div>
    </DataTableProvider>
  );
}
