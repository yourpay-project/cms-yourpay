import type { Updater } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import type {
  ColumnDef,
  DataTableInstance,
  PaginationState,
  SortingState,
  VisibilityState,
} from './data-table-types';

/** Parameters for `useDataTableInstance`. Mirrors controlled/uncontrolled options of `DataTable`. */
export interface UseDataTableInstanceParams<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialPageSize: number;
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (state: SortingState) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (state: VisibilityState) => void;
  rowCount?: number;
}

/** Return value of `useDataTableInstance`. Use with custom layout or subcomponents. */
export interface UseDataTableInstanceResult<TData> {
  /** TanStack Table instance for rendering Head/Body. */
  table: DataTableInstance<TData>;
  canPreviousPage: boolean;
  canNextPage: boolean;
  currentPage: number;
  totalPages: number;
  pagination: PaginationState;
}

/**
 * Applies TanStack's updater (value or function) to current state and either
 * calls the controlled callback or updates the uncontrolled setState.
 */
function applyUpdater<T>(
  updater: Updater<T>,
  current: T,
  setUncontrolled: React.Dispatch<React.SetStateAction<T>>,
  onControlled?: (state: T) => void,
): void {
  const next: T =
    typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
  if (onControlled) {
    onControlled(next);
  } else {
    setUncontrolled(next);
  }
}

/**
 * Hook that builds TanStack Table state and instance for the data-table widget.
 * Use with `DataTable` (default) or with custom layout using `DataTableHead`,
 * `DataTableBody`, and `DataTablePagination`.
 *
 * @param params - Column definitions, data, and optional controlled state (pagination, sorting, columnVisibility).
 * @returns Table instance plus derived pagination state (canPreviousPage, canNextPage, currentPage, totalPages).
 */
export function useDataTableInstance<TData, TValue>({
  columns,
  data,
  initialPageSize,
  pagination: controlledPagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  rowCount,
}: UseDataTableInstanceParams<TData, TValue>): UseDataTableInstanceResult<TData> {
  const [uncontrolledPagination, setUncontrolledPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialPageSize,
    });
  const [uncontrolledSorting, setUncontrolledSorting] =
    useState<SortingState>([]);
  const [uncontrolledColumnVisibility, setUncontrolledColumnVisibility] =
    useState<VisibilityState>({});

  const pagination: PaginationState =
    controlledPagination ?? uncontrolledPagination;
  const sorting: SortingState = controlledSorting ?? uncontrolledSorting;
  const columnVisibility: VisibilityState =
    controlledColumnVisibility ?? uncontrolledColumnVisibility;

  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting, columnVisibility },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      applyUpdater(
        updater,
        pagination,
        setUncontrolledPagination,
        onPaginationChange,
      );
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      applyUpdater(updater, sorting, setUncontrolledSorting, onSortingChange);
    },
    onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
      applyUpdater(
        updater,
        columnVisibility,
        setUncontrolledColumnVisibility,
        onColumnVisibilityChange,
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: Boolean(rowCount && onPaginationChange),
    pageCount:
      rowCount != null && pagination.pageSize > 0
        ? Math.ceil(rowCount / pagination.pageSize)
        : undefined,
  });

  const canPreviousPage: boolean = table.getCanPreviousPage();
  const canNextPage: boolean = table.getCanNextPage();
  const currentPage: number = pagination.pageIndex + 1;
  const totalPages: number = table.getPageCount();

  return {
    table,
    canPreviousPage,
    canNextPage,
    currentPage,
    totalPages,
    pagination,
  };
}
