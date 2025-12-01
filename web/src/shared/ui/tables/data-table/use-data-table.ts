/**
 * useDataTable - Hook principal
 * 
 * Implementa paginación inteligente con prefetch:
 * - Carga N items del backend (fetchSize)
 * - Muestra M items por página (pageSize)
 * - Cuando llega al límite del buffer, hace fetch de más datos
 */

"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { 
  BaseRow,
  DataTableState, 
  FetchParams, 
  FetchResult, 
  DataFetcher, 
  PaginationConfig,
  SortState,
} from './types';

const DEFAULT_CONFIG: PaginationConfig = {
  pageSize: 10,
  fetchSize: 20,
  initialPage: 1,
};

interface UseDataTableOptions<T extends BaseRow> {
  fetcher: DataFetcher<T>;
  config?: Partial<PaginationConfig>;
  initialSearch?: string;
  initialSort?: SortState;
  filters?: Record<string, unknown>;
  deps?: unknown[];
}

interface UseDataTableReturn<T extends BaseRow> {
  state: DataTableState<T>;
  /** Datos de la página actual */
  pageData: T[];
  /** Ir a página específica */
  setPage: (page: number) => void;
  /** Cambiar ordenamiento */
  setSort: (sort: SortState) => void;
  /** Cambiar búsqueda */
  setSearch: (search: string) => void;
  /** Refrescar datos */
  refresh: () => void;
  /** Ir a siguiente página */
  nextPage: () => void;
  /** Ir a página anterior */
  prevPage: () => void;
}

export function useDataTable<T extends BaseRow>(options: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const { 
    fetcher, 
    config: userConfig, 
    initialSearch = '',
    initialSort = { column: null, direction: 'asc' },
    filters = {},
    deps = [],
  } = options;

  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...userConfig }), [userConfig]);
  
  // Cache de datos
  const cache = useRef<Map<number, T[]>>(new Map());
  const totalRef = useRef<number>(0);

  const [state, setState] = useState<DataTableState<T>>({
    data: [],
    loading: true,
    error: null,
    pagination: {
      currentPage: config.initialPage || 1,
      totalItems: 0,
      totalPages: 0,
      pageSize: config.pageSize,
      hasNextPage: false,
      hasPrevPage: false,
    },
    sort: initialSort,
    search: initialSearch,
  });

  // Calcula qué "bloque" de fetch necesitamos para una página
  const getBlockForPage = useCallback((page: number): number => {
    const pagesPerBlock = Math.floor(config.fetchSize / config.pageSize);
    return Math.floor((page - 1) / pagesPerBlock);
  }, [config.fetchSize, config.pageSize]);

  // Fetch de un bloque de datos
  const fetchBlock = useCallback(async (
    blockIndex: number,
    sort: SortState,
    search: string,
  ): Promise<void> => {
    const pagesPerBlock = Math.floor(config.fetchSize / config.pageSize);
    const startPage = blockIndex * pagesPerBlock + 1;
    
    const params: FetchParams = {
      page: startPage,
      pageSize: config.fetchSize,
      sort,
      search: search || undefined,
      filters,
    };

    try {
      const result = await fetcher(params);
      
      // Guardar en cache por página
      const itemsPerPage = config.pageSize;
      for (let i = 0; i < pagesPerBlock; i++) {
        const pageNum = startPage + i;
        const startIdx = i * itemsPerPage;
        const pageData = result.data.slice(startIdx, startIdx + itemsPerPage);
        if (pageData.length > 0) {
          cache.current.set(pageNum, pageData);
        }
      }
      
      totalRef.current = result.total;
    } catch (err) {
      throw err;
    }
  }, [fetcher, config.fetchSize, config.pageSize, filters]);

  // Obtener datos de una página (del cache o fetchear)
  const getPageData = useCallback(async (
    page: number,
    sort: SortState,
    search: string,
    forceRefresh = false,
  ): Promise<T[]> => {
    // Si hay refresh, limpiar cache
    if (forceRefresh) {
      cache.current.clear();
    }

    // Verificar si está en cache
    if (!forceRefresh && cache.current.has(page)) {
      return cache.current.get(page) || [];
    }

    // Fetch del bloque correspondiente
    const blockIndex = getBlockForPage(page);
    await fetchBlock(blockIndex, sort, search);

    return cache.current.get(page) || [];
  }, [getBlockForPage, fetchBlock]);

  // Cargar página
  const loadPage = useCallback(async (
    page: number, 
    sort: SortState, 
    search: string,
    forceRefresh = false,
  ) => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const data = await getPageData(page, sort, search, forceRefresh);
      const total = totalRef.current;
      const totalPages = Math.ceil(total / config.pageSize);

      setState(s => ({
        ...s,
        data,
        loading: false,
        pagination: {
          currentPage: page,
          totalItems: total,
          totalPages,
          pageSize: config.pageSize,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }));

      // Prefetch siguiente bloque si estamos cerca del límite
      const pagesPerBlock = Math.floor(config.fetchSize / config.pageSize);
      const currentBlock = getBlockForPage(page);
      const positionInBlock = (page - 1) % pagesPerBlock;
      
      // Si estamos en la última página del bloque, prefetch el siguiente
      if (positionInBlock === pagesPerBlock - 1 && page < totalPages) {
        const nextBlock = currentBlock + 1;
        const nextBlockFirstPage = nextBlock * pagesPerBlock + 1;
        if (!cache.current.has(nextBlockFirstPage)) {
          // Prefetch silencioso
          fetchBlock(nextBlock, sort, search).catch(() => {});
        }
      }
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Error al cargar datos',
      }));
    }
  }, [getPageData, config.pageSize, config.fetchSize, getBlockForPage, fetchBlock]);

  // Efectos
  useEffect(() => {
    cache.current.clear();
    loadPage(1, state.sort, state.search, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.search, state.sort.column, state.sort.direction, ...deps]);

  // Acciones
  const setPage = useCallback((page: number) => {
    if (page < 1 || page > state.pagination.totalPages) return;
    loadPage(page, state.sort, state.search);
  }, [loadPage, state.sort, state.search, state.pagination.totalPages]);

  const setSort = useCallback((sort: SortState) => {
    cache.current.clear();
    setState(s => ({ ...s, sort }));
  }, []);

  const setSearch = useCallback((search: string) => {
    cache.current.clear();
    setState(s => ({ ...s, search }));
  }, []);

  const refresh = useCallback(() => {
    cache.current.clear();
    loadPage(state.pagination.currentPage, state.sort, state.search, true);
  }, [loadPage, state.pagination.currentPage, state.sort, state.search]);

  const nextPage = useCallback(() => {
    if (state.pagination.hasNextPage) {
      setPage(state.pagination.currentPage + 1);
    }
  }, [setPage, state.pagination.hasNextPage, state.pagination.currentPage]);

  const prevPage = useCallback(() => {
    if (state.pagination.hasPrevPage) {
      setPage(state.pagination.currentPage - 1);
    }
  }, [setPage, state.pagination.hasPrevPage, state.pagination.currentPage]);

  return {
    state,
    pageData: state.data,
    setPage,
    setSort,
    setSearch,
    refresh,
    nextPage,
    prevPage,
  };
}
