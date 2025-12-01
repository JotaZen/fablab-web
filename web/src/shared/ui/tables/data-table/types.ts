/**
 * DataTable - Tipos
 */

// Tipo base más flexible para soportar interfaces con propiedades definidas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseRow = Record<string, any>;

export interface ColumnDef<T extends BaseRow> {
  /** ID único de la columna */
  id: string;
  /** Texto del header */
  header: string;
  /** Función para obtener el valor de la celda */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Clase CSS para la celda */
  className?: string;
  /** Clase CSS para el header */
  headerClassName?: string;
  /** Si la columna es sorteable */
  sortable?: boolean;
  /** Ancho de la columna */
  width?: string | number;
}

export interface PaginationConfig {
  /** Items por página visible */
  pageSize: number;
  /** Items a cargar por fetch (múltiplo de pageSize) */
  fetchSize: number;
  /** Página inicial */
  initialPage?: number;
}

export interface PaginationState {
  /** Página actual (1-indexed) */
  currentPage: number;
  /** Total de items */
  totalItems: number;
  /** Total de páginas */
  totalPages: number;
  /** Items por página */
  pageSize: number;
  /** Si hay más páginas */
  hasNextPage: boolean;
  /** Si hay páginas anteriores */
  hasPrevPage: boolean;
}

export interface SortState {
  /** Columna por la que se ordena */
  column: string | null;
  /** Dirección del orden */
  direction: 'asc' | 'desc';
}

export interface DataTableState<T extends BaseRow> {
  /** Datos cargados */
  data: T[];
  /** Estado de carga */
  loading: boolean;
  /** Error si hay */
  error: string | null;
  /** Estado de paginación */
  pagination: PaginationState;
  /** Estado de ordenamiento */
  sort: SortState;
  /** Búsqueda actual */
  search: string;
}

export interface FetchParams {
  page: number;
  pageSize: number;
  sort?: SortState;
  search?: string;
  filters?: Record<string, unknown>;
}

export interface FetchResult<T extends BaseRow> {
  data: T[];
  total: number;
}

export type DataFetcher<T extends BaseRow> = (params: FetchParams) => Promise<FetchResult<T>>;

export interface DataTableProps<T extends BaseRow> {
  /** Definición de columnas */
  columns: ColumnDef<T>[];
  /** Función para obtener datos */
  fetcher: DataFetcher<T>;
  /** Configuración de paginación */
  pagination?: Partial<PaginationConfig>;
  /** Habilitar búsqueda */
  searchable?: boolean;
  /** Placeholder del buscador */
  searchPlaceholder?: string;
  /** Función para obtener el ID de una fila */
  getRowId?: (row: T) => string;
  /** Clase CSS para la tabla */
  className?: string;
  /** Mensaje cuando no hay datos */
  emptyMessage?: string;
  /** Acciones por fila */
  rowActions?: (row: T) => React.ReactNode;
  /** Callback al seleccionar fila */
  onRowClick?: (row: T) => void;
  /** Filtros adicionales */
  filters?: Record<string, unknown>;
  /** Dependencias para refetch */
  deps?: unknown[];
}
