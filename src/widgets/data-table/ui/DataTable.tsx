import { Table, ErrorBoundary } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

import type { DataTableProps } from '../model/data-table-types';
import { useDataTableInstance } from '../model/use-data-table-instance';
import { DataTableHead } from './DataTableHead';
import { DataTableBody } from './DataTableBody';
import { DataTablePagination } from './DataTablePagination';

export type { DataTableProps } from '../model/data-table-types';

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
  rowCount,
}: DataTableProps<TData, TValue>): JSX.Element {
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
      <div className={cn('space-y-4', className)}>
        <div className="rounded-md border border-border bg-card">
          <Table>
            <DataTableHead table={table} />
            <DataTableBody table={table} columnCount={columns.length} />
          </Table>
        </div>

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
    </ErrorBoundary>
  );
}
