import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnPinningState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableBody } from "./data-table-body";
import { DataTableSummary } from "./data-table-summary";
import { DataTableLoadingOverlay } from "./data-table-loading-overlay";
import { DataTableLoadingSpinner } from "./data-table-loading-spinner";
import { DataTableEmpty } from "./data-table-empty";
import {
  getPinningStyles,
  useScrollShadow,
  DEFAULT_SKELETON_ROW_COUNT,
} from "../lib/table-utils";
import type { DataTableProps as DataTablePropsType } from "../lib/data-table-types";
import { DEFAULT_EMPTY_MESSAGE } from "../lib/data-table-types";
import { cn } from "@/shared/lib/utils";

/**
 * Generic enterprise DataTable (AntD-style) with semantic styling.
 *
 * Features: sticky header, column pinning (freeze left/right), horizontal and
 * vertical scroll shadows (theme-aware), row selection (cross-page, invert,
 * conditional), expandable rows, summary footer, empty/loading states,
 * onCell/onRow (colSpan/rowSpan), multi-sort, a11y (role="grid", aria-sort, aria-expanded).
 *
 * When `enableVerticalShadow` is true: top shadow appears when scrolled down;
 * bottom shadow is a fixed overlay at the viewport bottom (does not scroll with
 * rows) and hides when the user scrolls to the very bottom.
 *
 * @param props - See {@link DataTableProps}
 * @returns Table wrapper with header, body, optional summary and pagination
 */
const SIZE_CLASSES = {
  small: { header: "px-2 py-2 text-xs", cell: "px-2 py-2 text-xs" },
  medium: { header: "px-4 py-3.5 text-sm", cell: "px-4 py-3 text-sm" },
  large: { header: "px-4 py-4 text-sm", cell: "px-4 py-4 text-sm" },
} as const;

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  scroll,
  scrollHeight: scrollHeightLegacy,
  isLoading = false,
  showHeader = true,
  size = "medium",
  title,
  footer,
  rowClassName,
  rowHoverable = true,
  tableLayout,
  locale,
  enableVerticalShadow,
  initialColumnPinning,
  initialSorting = [],
  initialColumnVisibility,
  getRowId,
  selection,
  expandable,
  summary,
  empty,
  loading,
  onCell,
  onRow,
  showPagination = true,
  pageSizeOptions,
  bordered = true,
  pageCount: pageCountProp,
  pagination: paginationProp,
  onPaginationChange,
  onChange,
}: DataTablePropsType<TData, TValue>): React.ReactElement {
  const scrollY = scroll?.y ?? scrollHeightLegacy ?? "600px";
  const scrollX = scroll?.x;
  const resolvedScrollHeight = typeof scrollY === "number" ? `${scrollY}px` : scrollY;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const shadow = useScrollShadow(scrollRef);

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialColumnVisibility ?? {}
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    selection?.rowSelection ?? {}
  );
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialColumnPinning ?? { left: [], right: [] }
  );
  const [clientPagination, setClientPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isServerPagination = pageCountProp != null && paginationProp != null && onPaginationChange != null;
  const paginationState = isServerPagination ? paginationProp : clientPagination;

  React.useEffect(() => {
    if (selection?.rowSelection != null) {
      setRowSelection(selection.rowSelection);
    }
  }, [selection?.rowSelection]);

  const table = useReactTable({
    data,
    columns,
    ...(getRowId && { getRowId: getRowId as (row: TData, index: number) => string }),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnPinning,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      );
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      selection?.onSelectionChange?.(next);
    },
    onColumnPinningChange: (updater) => {
      setColumnPinning((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      );
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(paginationState) : updater;
      if (isServerPagination && onPaginationChange) {
        onPaginationChange(next);
      } else {
        setClientPagination(next);
      }
    },
    manualPagination: isServerPagination,
    pageCount: isServerPagination ? pageCountProp : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(isServerPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: expandable?.getSubRows as (row: TData) => TData[] | undefined,
    getRowCanExpand: expandable?.getRowCanExpand,
    enableRowSelection: selection?.enableRowSelection ?? false,
    enableMultiRowSelection: true,
  });

  React.useEffect(() => {
    const pageCount = isServerPagination
      ? (pageCountProp ?? 0)
      : Math.ceil((table.getRowCount() || 0) / paginationState.pageSize) || 1;
    onChange?.({
      pagination: {
        pageIndex: paginationState.pageIndex,
        pageSize: paginationState.pageSize,
        pageCount,
      },
      sorting,
      columnVisibility,
    });
  }, [
    onChange,
    paginationState.pageIndex,
    paginationState.pageSize,
    sorting,
    columnVisibility,
    isServerPagination,
    pageCountProp,
    paginationState,
    table,
  ]);

  const loadingVariant = loading?.loadingVariant ?? "skeleton";
  const skeletonRows = loading?.skeletonRowCount ?? DEFAULT_SKELETON_ROW_COUNT;
  const emptyMsg =
    empty?.emptyMessage ??
    (typeof locale?.emptyText === "string" ? locale.emptyText : undefined) ??
    DEFAULT_EMPTY_MESSAGE;
  const visibleColumns = table.getVisibleLeafColumns().length;
  const sizeClasses = SIZE_CLASSES[size];
  const currentPageData = table.getRowModel().rows.map((r) => r.original);
  const titleNode = typeof title === "function" ? title(currentPageData) : title;
  const footerNode = typeof footer === "function" ? footer(currentPageData) : footer;

  return (
    <div className="flex w-full flex-col gap-4" role="grid" aria-label="Data table">
      {selection?.showSelectionActions && (
        <DataTableToolbar table={table} />
      )}
      {titleNode != null && (
        <div className="text-sm font-medium text-foreground">{titleNode}</div>
      )}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className={cn(
            "custom-scrollbar w-full overflow-auto rounded-lg border border-border bg-card",
            bordered && "border"
          )}
          style={{
            height: resolvedScrollHeight,
            maxHeight: resolvedScrollHeight,
            ...(scrollX != null && scrollX !== true && { minWidth: typeof scrollX === "number" ? `${scrollX}px` : scrollX }),
          }}
        >
          <Table
          className={cn(
            "min-w-max border-separate border-spacing-0 text-foreground",
            tableLayout === "fixed" && "table-fixed"
          )}
          style={tableLayout === "fixed" ? { tableLayout: "fixed" } : undefined}
          role="grid"
        >
          {showHeader && (
            <TableHeader
              className={cn(
                "sticky top-0 z-20 border-b border-border bg-muted",
                enableVerticalShadow && shadow.showTop && "data-table-shadow-top"
              )}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-none hover:bg-transparent"
                  role="row"
                >
                  {headerGroup.headers.map((header) => {
                    const isPinned = header.column.getIsPinned();
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
                    const ariaSort =
                      sortDir === false
                        ? undefined
                        : sortDir === "asc"
                          ? "ascending"
                          : "descending";
                    const align = header.column.columnDef.meta?.align ?? "left";
                    const alignClass =
                      align === "center"
                        ? "text-center"
                        : align === "right"
                          ? "text-right"
                          : "text-left";
                    return (
                      <TableHead
                        key={header.id}
                        style={getPinningStyles(header.column, true)}
                        className={cn(
                          "border-b border-border bg-muted font-semibold text-foreground",
                          sizeClasses.header,
                          alignClass,
                          isPinned === "left" && "border-r border-border",
                          isPinned === "left" && shadow.showLeft && "data-table-shadow-left",
                          isPinned === "right" && "border-l border-border",
                          isPinned === "right" && shadow.showRight && "data-table-shadow-right"
                        )}
                        role="columnheader"
                        aria-sort={canSort ? ariaSort : undefined}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <DataTableBody
            table={table}
            onCell={onCell}
            onRow={onRow}
            expandedRowRender={expandable?.expandedRowRender}
            isLoading={isLoading}
            colSpan={visibleColumns}
            scrollShadow={shadow}
            emptyComponent={empty?.emptyComponent}
            emptyMessage={emptyMsg}
            rowClassName={rowClassName}
            rowHoverable={rowHoverable}
            sizeCellClass={sizeClasses.cell}
            LoadingComponent={(props) =>
              loadingVariant === "spinner" ? (
                <DataTableLoadingSpinner colSpan={props.colSpan} />
              ) : (
                <DataTableLoadingOverlay
                  colSpan={props.colSpan}
                  rowCount={skeletonRows}
                />
              )
            }
            EmptyComponent={(props) => (
              <DataTableEmpty
                colSpan={props.colSpan}
                emptyComponent={props.emptyComponent}
                emptyMessage={props.emptyMessage}
              />
            )}
          />
          {footerNode != null && (
            <tfoot className="border-t border-border bg-muted">
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleColumns}
                  className="px-4 py-2 text-sm text-muted-foreground"
                >
                  {footerNode}
                </TableCell>
              </TableRow>
            </tfoot>
          )}
          {summary && summary.summaryRows.length > 0 && (
            <tfoot className="sticky bottom-0 z-10 border-t-2 border-border bg-muted">
              <DataTableSummary
                table={table}
                summaryRows={summary.summaryRows}
                renderSummaryCell={summary.renderSummaryCell}
              />
            </tfoot>
          )}
        </Table>
        </div>
        {/* Shadow overlay outside scroll area so it does not move when content scrolls */}
        {enableVerticalShadow && shadow.showBottom && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 rounded-b-lg"
            style={{
              background: "linear-gradient(to top, hsl(var(--foreground) / 0.08), transparent)",
            }}
            aria-hidden
          />
        )}
      </div>
      {showPagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}

export type { DataTablePropsType as DataTableProps };
