/**
 * DataTable - Context
 * 
 * Maneja el estado de la tabla y la lógica de paginación inteligente.
 */

"use client";

import { createContext, useContext, type ReactNode } from 'react';
import type { DataTableState, SortState, PaginationState, BaseRow } from './types';

interface DataTableContextValue<T extends BaseRow> {
  state: DataTableState<T>;
  // Acciones
  setPage: (page: number) => void;
  setSort: (sort: SortState) => void;
  setSearch: (search: string) => void;
  refresh: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

export function DataTableProvider<T extends BaseRow>({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: DataTableContextValue<T>;
}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DataTableContext.Provider value={value as DataTableContextValue<any>}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<T extends BaseRow>(): DataTableContextValue<T> {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider');
  }
  return context as DataTableContextValue<T>;
}

// Selector helpers
export function useDataTableData<T extends BaseRow>(): T[] {
  const { state } = useDataTableContext<T>();
  return state.data;
}

export function useDataTablePagination(): PaginationState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state } = useDataTableContext<any>();
  return state.pagination;
}

export function useDataTableLoading(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state } = useDataTableContext<any>();
  return state.loading;
}

export function useDataTableError(): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state } = useDataTableContext<any>();
  return state.error;
}
