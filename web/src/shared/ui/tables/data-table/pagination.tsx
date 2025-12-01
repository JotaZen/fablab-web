/**
 * DataTable - Componente de Paginación
 */

"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { PaginationState } from './types';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
  /** Mostrar selector de items por página */
  showPageSize?: boolean;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  pagination,
  onPageChange,
  loading = false,
  className,
  showPageSize = false,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const { currentPage, totalPages, totalItems, pageSize, hasNextPage, hasPrevPage } = pagination;

  // Calcular rango de items mostrados
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generar números de página a mostrar
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Siempre mostrar última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1 && !showPageSize) {
    return null;
  }

  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-4 px-2 py-3",
      className
    )}>
      {/* Info de items */}
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <>
            Mostrando <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </>
        ) : (
          'Sin resultados'
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Selector de tamaño de página */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="h-8 rounded-md border bg-background px-2 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Paginación">
            {/* Primera página */}
            <button
              onClick={() => onPageChange(1)}
              disabled={!hasPrevPage || loading}
              className={cn(
                "h-8 w-8 rounded-md border flex items-center justify-center transition-colors",
                "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Página anterior */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrevPage || loading}
              className={cn(
                "h-8 w-8 rounded-md border flex items-center justify-center transition-colors",
                "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => (
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={loading}
                    className={cn(
                      "h-8 min-w-[2rem] rounded-md border px-2 text-sm font-medium transition-colors",
                      page === currentPage
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    )}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Página siguiente */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNextPage || loading}
              className={cn(
                "h-8 w-8 rounded-md border flex items-center justify-center transition-colors",
                "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Última página */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={!hasNextPage || loading}
              className={cn(
                "h-8 w-8 rounded-md border flex items-center justify-center transition-colors",
                "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
