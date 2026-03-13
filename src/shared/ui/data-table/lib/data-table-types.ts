import type {
  ColumnDef,
  ColumnPinningState,
  Row,
  RowData,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Header filter menu type: 'checkbox' | 'radio' | 'custom' */
    filterVariant?: "checkbox" | "radio" | "text" | "custom";
    /** Filter options for checkbox/radio (value, label). */
    filterOptions?: ReadonlyArray<{ value: string; label: string }>;
    /** Optional alignment for header + body cells: left | center | right (default: left). */
    align?: "left" | "center" | "right";
    /** Internal anchor to keep generic parameters used for tooling. */
    _dataType?: TData;
    /** Internal anchor to keep generic parameters used for tooling. */
    _valueType?: TValue;
  }
}

/** Cell attributes from onCell (colSpan, rowSpan, class, etc.). */
export interface TableCellProps {
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
}

/** Row attributes from onRow (class, onClick, etc.). */
export interface TableRowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
}

/** Selection config: cross-page, conditional, and optional controlled state. */
export interface DataTableSelectionConfig<TData> {
  /** Enable row selection. Use function for conditional (e.g. disable for "Success" rows). */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /** Controlled selection state (row id -> selected). */
  rowSelection?: Record<string, boolean>;
  /** Callback when selection changes. */
  onSelectionChange?: (selection: Record<string, boolean>) => void;
  /** Column id for the selection checkbox column. */
  selectionColumnId?: string;
  /** Show "Invert selection" / "Clear" in toolbar. */
  showSelectionActions?: boolean;
}

/** Expandable / tree row config. */
export interface DataTableExpandableConfig<TData> {
  /** Return sub-rows for tree data. */
  getSubRows?: (row: TData) => TData[] | undefined;
  /** Custom expanded row render (full row replace). */
  expandedRowRender?: (row: Row<TData>) => ReactNode;
  /** Whether row can expand (default: has subRows or expandedRowRender). */
  getRowCanExpand?: (row: Row<TData>) => boolean;
}

/** Summary row (sticky footer) config. */
export interface DataTableSummaryConfig {
  /** Summary rows (e.g. one row for totals). */
  summaryRows: Record<string, unknown>[];
  /** Render cell for summary. (columnId, summaryRow, column) => ReactNode */
  renderSummaryCell?: (
    columnId: string,
    summaryRow: Record<string, unknown>,
    columnIndex: number
  ) => ReactNode;
}

/** Empty state config. */
export interface DataTableEmptyConfig {
  /** Custom empty component (replaces default "No data found."). */
  emptyComponent?: ReactNode;
  /** Default empty message when emptyComponent not provided. */
  emptyMessage?: string;
}

/** Loading state config. */
export interface DataTableLoadingConfig {
  /** 'skeleton' = skeleton rows in body; 'spinner' = single row with centered spinner inside table. */
  loadingVariant?: "skeleton" | "spinner";
  /** Skeleton row count when loadingVariant is 'skeleton'. */
  skeletonRowCount?: number;
}

/** Responsive: column visibility by breakpoint. Keys are column ids. */
export type ResponsiveColumnVisibility = Record<string, boolean>;

/** Filter state: column id -> filter value. */
export type DataTableFilterState = Record<string, unknown>;

/**
 * Props for the shared DataTable component.
 *
 * All colors and borders use semantic tokens (e.g. bg-background, border-border)
 * so the table respects the app theme. Column pinning and scroll shadow are
 * applied via initialColumnPinning and the internal useScrollShadow hook.
 */
export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  scrollHeight?: string;
  isLoading?: boolean;
  initialColumnPinning?: ColumnPinningState;
  /** Initial sort (multi-column supported). */
  initialSorting?: SortingState;
  /** Initial column visibility (responsive). */
  initialColumnVisibility?: VisibilityState;
  /** Initial filter values. */
  initialFiltering?: DataTableFilterState;
  /** Unique row id for selection across pages. */
  getRowId?: (row: TData, index: number) => string;
  /** Selection (cross-page, conditional, toolbar). */
  selection?: DataTableSelectionConfig<TData>;
  /** Expandable / tree rows. */
  expandable?: DataTableExpandableConfig<TData>;
  /** Sticky summary footer. */
  summary?: DataTableSummaryConfig;
  /** Empty state. */
  empty?: DataTableEmptyConfig;
  /** Loading state. */
  loading?: DataTableLoadingConfig;
  /** onCell hook for colSpan, rowSpan, className. */
  onCell?: (row: Row<TData>, columnId: string) => TableCellProps | undefined;
  /** onRow hook for className, onClick, aria. */
  onRow?: (row: Row<TData>) => TableRowProps | undefined;
  /** Enable virtual scroll for large data (requires @tanstack/react-virtual). */
  enableVirtualScroll?: boolean;
  /** Estimated row height for virtual scroll. */
  virtualRowHeight?: number;
  /** Pagination: show or hide. */
  showPagination?: boolean;
  /** Page size options. */
  pageSizeOptions?: readonly number[];
  /** Bordered table style. */
  bordered?: boolean;
  /** Server-side pagination: total number of pages (required when pagination is provided). */
  pageCount?: number;
  /** Controlled pagination state (use with pageCount and onPaginationChange for server-side). */
  pagination?: { pageIndex: number; pageSize: number };
  /** Called when user changes page or page size (for server-side pagination). */
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

/** Default empty message. */
export const DEFAULT_EMPTY_MESSAGE = "No data found.";
