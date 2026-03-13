import type {
  ColumnDef,
  PaginationState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';

export type { ColumnDef, PaginationState, SortingState, VisibilityState };

/**
 * Table instance returned by `useReactTable`, passed to Head/Body subcomponents
 * for rendering headers and rows.
 */
export type DataTableInstance<TData> = Table<TData>;

/**
 * Props for the main `DataTable` component.
 * Supports both client-side and server-side pagination via controlled state.
 */
export interface DataTableProps<TData, TValue> {
  /** TanStack Table column definitions. */
  columns: ColumnDef<TData, TValue>[];
  /** Row data for the current page (or all data when using client-side pagination). */
  data: TData[];
  /** Initial page size when uncontrolled. Defaults to 10. */
  initialPageSize?: number;
  /** Controlled pagination state. When set, use with `onPaginationChange`. */
  pagination?: PaginationState;
  /** Called when pagination changes. Pass with `rowCount` for server-side pagination. */
  onPaginationChange?: (state: PaginationState) => void;
  /** Controlled sorting state. */
  sorting?: SortingState;
  /** Called when sorting changes. */
  onSortingChange?: (state: SortingState) => void;
  /** Controlled column visibility map (column id → boolean). */
  columnVisibility?: VisibilityState;
  /** Called when column visibility changes. */
  onColumnVisibilityChange?: (state: VisibilityState) => void;
  /** Optional class name for the root wrapper. */
  className?: string;
  /** Optional class name for the underlying `<table>` element. */
  tableClassName?: string;
  /** Total row count from server; required for correct page count when using server-side pagination. */
  rowCount?: number;
}
