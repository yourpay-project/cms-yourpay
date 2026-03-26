import { Table, ErrorBoundary } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

import { type DataTableProps, useDataTableInstance } from '../model';
import { DataTableHead } from './DataTableHead';
import { DataTableBody } from './DataTableBody';
import { DataTablePagination } from './DataTablePagination';

export type { DataTableProps } from '../model';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Generic data table with TanStack Table, shadcn styling, and built-in pagination.
 * Renders Head, Body, and Pagination; supports client-side and server-side pagination.
 * Use subcomponents (`DataTableHead`, `DataTableBody`, `DataTablePagination`) with
 * `useDataTableInstance` for custom layouts.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  initialPageSize = DEFAULT_PAGE_SIZE,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  className,
  tableClassName,
  rowCount,
}: DataTableProps<TData, TValue>): React.JSX.Element {
  const {
    table,
    canPreviousPage,
    canNextPage,
    currentPage,
    totalPages,
  } = useDataTableInstance<TData, TValue>({
    columns,
    data,
    initialPageSize,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    columnVisibility,
    onColumnVisibilityChange,
    rowCount,
  });

  return (
    <ErrorBoundary>
      <div className={cn("flex h-full flex-col", className)}>
        <div className="relative flex-1 min-h-0 rounded-lg border border-border bg-card shadow-sm">
          <div className="h-full overflow-auto bg-card">
            <Table className={cn('min-w-full', tableClassName)}>
              <DataTableHead table={table} />
              <DataTableBody table={table} columnCount={columns.length} />
            </Table>
          </div>

          <div className="sticky bottom-0 border-t border-border/60 bg-card px-4 py-2">
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowCount={rowCount}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              onFirstPage={() => table.firstPage()}
              onPreviousPage={() => table.previousPage()}
              onNextPage={() => table.nextPage()}
              onLastPage={() => table.lastPage()}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
