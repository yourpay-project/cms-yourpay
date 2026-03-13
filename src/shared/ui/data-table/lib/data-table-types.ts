/**
 * Types and interfaces for the shared DataTable component.
 * Includes ColumnMeta augmentation for TanStack Table, config types (selection, expandable,
 * summary, empty, loading), and the main DataTableProps interface.
 */
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
    /** Ellipsis cell content; use title attribute when showTitle (AntD-style). */
    ellipsis?: boolean | { showTitle?: boolean };
    /** Internal anchor to keep generic parameters used for tooling. */
    _dataType?: TData;
    /** Internal anchor to keep generic parameters used for tooling. */
    _valueType?: TValue;
  }
}

/**
 * Cell attributes returned from DataTableProps.onCell.
 * Used for colSpan, rowSpan, className, style, and aria-hidden.
 */
export interface TableCellProps {
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
}

/**
 * Row attributes returned from DataTableProps.onRow.
 * Used for className, style, onClick, and ARIA attributes.
 */
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

/** Column visibility by breakpoint. Keys are column ids, values are boolean. */
export type ResponsiveColumnVisibility = Record<string, boolean>;

/** Filter state: column id -> filter value. Used for controlled filtering. */
export type DataTableFilterState = Record<string, unknown>;

/** Table size (cell padding / density). AntD: small | medium | large. */
export type DataTableSize = "small" | "medium" | "large";

/** Scroll config (AntD-style). y = max height, x = min width. */
export interface DataTableScrollConfig {
  /** Max height of scroll area (vertical). */
  y?: string | number;
  /** Min/max width of scroll area (horizontal). */
  x?: string | number | true;
  /** Scroll to first row when pagination/filter/sort changes. */
  scrollToFirstRowOnChange?: boolean;
}

/** Locale strings for table (emptyText, filter labels, sort labels, etc.). */
export interface DataTableLocale {
  emptyText?: ReactNode;
  filterConfirm?: ReactNode;
  filterReset?: ReactNode;
  filterEmptyText?: ReactNode;
  filterCheckall?: ReactNode;
  selectionAll?: ReactNode;
  selectInvert?: ReactNode;
  selectNone?: ReactNode;
  selectAll?: ReactNode;
  selectCurrentPage?: ReactNode;
  sortTitle?: ReactNode;
  expand?: ReactNode;
  collapse?: ReactNode;
  triggerDesc?: ReactNode;
  triggerAsc?: ReactNode;
  cancelSort?: ReactNode;
}

/**
 * Props for the shared DataTable component.
 * Aligned with Ant Design Table API where applicable.
 *
 * All colors and borders use semantic tokens (e.g. bg-background, border-border)
 * so the table respects the app theme.
 */
export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Scroll: use scroll.y for height, scroll.x for min width (AntD-style). */
  scroll?: DataTableScrollConfig;
  /** @deprecated Use scroll.y instead. */
  scrollHeight?: string;
  isLoading?: boolean;
  /** Whether to show table header. */
  showHeader?: boolean;
  /** Table size: cell padding and density (AntD size). */
  size?: DataTableSize;
  /** Table title renderer (above table). AntD title. */
  title?: ReactNode | ((currentPageData: TData[]) => ReactNode);
  /** Table footer renderer (below table body, above summary). AntD footer. */
  footer?: ReactNode | ((currentPageData: TData[]) => ReactNode);
  /** Row className (AntD rowClassName). */
  rowClassName?: (row: Row<TData>) => string;
  /** Whether row is hoverable. */
  rowHoverable?: boolean;
  /** CSS table-layout. AntD tableLayout. */
  tableLayout?: "auto" | "fixed";
  /** Locale text (emptyText, etc.). */
  locale?: DataTableLocale;
  /**
   * Enable vertical scroll shadows: top shadow when scrolled down; bottom shadow
   * fixed at viewport bottom (hides when scrolled to the very bottom).
   */
  enableVerticalShadow?: boolean;
  initialColumnPinning?: ColumnPinningState;
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;
  initialFiltering?: DataTableFilterState;
  getRowId?: (row: TData, index: number) => string;
  selection?: DataTableSelectionConfig<TData>;
  expandable?: DataTableExpandableConfig<TData>;
  summary?: DataTableSummaryConfig;
  empty?: DataTableEmptyConfig;
  loading?: DataTableLoadingConfig;
  onCell?: (row: Row<TData>, columnId: string) => TableCellProps | undefined;
  onRow?: (row: Row<TData>) => TableRowProps | undefined;
  enableVirtualScroll?: boolean;
  virtualRowHeight?: number;
  showPagination?: boolean;
  pageSizeOptions?: readonly number[];
  bordered?: boolean;
  pageCount?: number;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  /** Unified onChange (pagination, filters, sorter). AntD onChange. */
  onChange?: (info: {
    pagination: { pageIndex: number; pageSize: number; pageCount: number };
    sorting: SortingState;
    columnVisibility?: VisibilityState;
  }) => void;
}

/**
 * Default empty message when no data and empty.emptyMessage / locale.emptyText are not set.
 */
export const DEFAULT_EMPTY_MESSAGE = "No data found.";
