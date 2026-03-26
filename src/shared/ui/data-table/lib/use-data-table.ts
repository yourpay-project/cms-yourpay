import * as React from "react";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnPinningState,
  type RowSelectionState,
  type SortingState,
  type Table,
  type VisibilityState,
} from "@tanstack/react-table";
import type { DataTableProps } from "./data-table-types";
import { DEFAULT_EMPTY_MESSAGE } from "./data-table-types";
import { DEFAULT_SCROLL_HEIGHT, SIZE_CLASSES } from "./data-table-constants";
import { DEFAULT_SKELETON_ROW_COUNT, useScrollShadow } from "./table-utils";

/**
 * Return value of {@link useDataTable}. Contains the table instance, scroll ref,
 * shadow state, and derived values for rendering the DataTable UI.
 */
export interface UseDataTableResult<TData> {
  /** TanStack Table instance (from useReactTable). */
  table: Table<TData>;
  /** Ref to attach to the scrollable container (for useScrollShadow). */
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /** Scroll shadow flags (showLeft, showRight, showTop, showBottom). */
  shadow: ReturnType<typeof useScrollShadow>;
  /** Resolved CSS height for the scroll viewport (e.g. TABLE_BODY_VIEWPORT_HEIGHT or "calc(100vh - 320px)"). */
  resolvedScrollHeight: string;
  /** Inline style for the scroll div: height auto, maxHeight resolvedScrollHeight; content-sized when short, scrolls when tall. */
  scrollStyle: React.CSSProperties;
  /** Tailwind classes for header and cell padding (from SIZE_CLASSES[size]). */
  sizeClasses: (typeof SIZE_CLASSES)[keyof typeof SIZE_CLASSES];
  /** Resolved empty message (empty.emptyMessage ?? locale.emptyText ?? DEFAULT_EMPTY_MESSAGE). */
  emptyMsg: string;
  /** Rendered title (function result or node). */
  titleNode: React.ReactNode;
  /** Rendered footer (function result or node). */
  footerNode: React.ReactNode;
  /** Loading UI variant: "skeleton" or "spinner". */
  loadingVariant: "skeleton" | "spinner";
  /** Number of skeleton rows when loadingVariant is "skeleton". */
  skeletonRows: number;
  /** Count of visible leaf columns (for colSpan). */
  visibleColumns: number;
  /** True when pageCount, pagination, and onPaginationChange are all provided. */
  isServerPagination: boolean;
}

/**
 * Central hook for DataTable: manages table state, useReactTable instance,
 * scroll shadow, and derived values (empty message, title/footer nodes, etc.).
 * Keeps the main DataTable component thin and delegates logic here.
 *
 * @param props - Full DataTable props (columns, data, scroll, selection, pagination, etc.).
 * @returns {@link UseDataTableResult} with table, scrollRef, shadow, scrollStyle, sizeClasses,
 *   emptyMsg, titleNode, footerNode, loadingVariant, skeletonRows, visibleColumns, isServerPagination.
 */
export function useDataTable<TData>(
  props: DataTableProps<TData, unknown>
): UseDataTableResult<TData> {
  const {
    columns,
    data,
    scroll,
    scrollHeight: scrollHeightLegacy,
    size = "medium",
    title,
    footer,
    empty,
    loading,
    locale,
    getRowId,
    selection,
    expandable,
    pageCount: pageCountProp,
    pagination: paginationProp,
    onPaginationChange,
    onChange,
  } = props;

  const scrollY = scroll?.y ?? scrollHeightLegacy ?? DEFAULT_SCROLL_HEIGHT;
  const scrollX = scroll?.x;
  let resolvedScrollHeight = String(scrollY);
  if (typeof scrollY === "number") {
    resolvedScrollHeight = `${scrollY}px`;
  }

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const shadow = useScrollShadow(scrollRef);

  const [sorting, setSorting] = React.useState<SortingState>(
    props.initialSorting ?? []
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    VisibilityState
  >(props.initialColumnVisibility ?? {});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    selection?.rowSelection ?? {}
  );
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    props.initialColumnPinning ?? { left: [], right: [] }
  );
  const [clientPagination, setClientPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isServerPagination =
    pageCountProp != null &&
    paginationProp != null &&
    onPaginationChange != null;
  let paginationState = clientPagination;
  if (isServerPagination) {
    paginationState = paginationProp!;
  }

  let resolvedPageCount: number | undefined = undefined;
  if (isServerPagination) {
    resolvedPageCount = pageCountProp;
  }

  let paginationRowModelOptions: {
    getPaginationRowModel?: ReturnType<typeof getPaginationRowModel>;
  } = {};
  if (!isServerPagination) {
    paginationRowModelOptions = { getPaginationRowModel: getPaginationRowModel() };
  }

  React.useEffect(() => {
    if (selection?.rowSelection != null) {
      setRowSelection(selection.rowSelection);
    }
  }, [selection?.rowSelection]);

  const onColumnVisibilityChange = React.useCallback(
    (updater: React.SetStateAction<VisibilityState>) => {
      setColumnVisibility((prev) => {
        if (typeof updater === "function") {
          return updater(prev);
        }
        return updater;
      });
    },
    []
  );

  const onRowSelectionChange = React.useCallback(
    (updater: React.SetStateAction<RowSelectionState>) => {
      let next: RowSelectionState = updater;
      if (typeof updater === "function") {
        next = updater(rowSelection);
      }
      setRowSelection(next);
      selection?.onSelectionChange?.(next);
    },
    [rowSelection, selection]
  );

  const onColumnPinningChange = React.useCallback(
    (updater: React.SetStateAction<ColumnPinningState>) => {
      setColumnPinning((prev) => {
        if (typeof updater === "function") {
          return updater(prev);
        }
        return updater;
      });
    },
    []
  );

  const onPaginationChangeInternal = React.useCallback(
    (updater: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => {
      let next = updater;
      if (typeof updater === "function") {
        next = updater(paginationState);
      }
      if (isServerPagination && onPaginationChange) {
        onPaginationChange(next);
      } else {
        setClientPagination(next);
      }
    },
    [isServerPagination, onPaginationChange, paginationState]
  );

  const table = useReactTable({
    data,
    columns,
    ...(getRowId && {
      getRowId: getRowId as (row: TData, index: number) => string,
    }),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnPinning,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange,
    onRowSelectionChange,
    onColumnPinningChange,
    onPaginationChange: onPaginationChangeInternal,
    manualPagination: isServerPagination,
    pageCount: resolvedPageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...paginationRowModelOptions,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: expandable?.getSubRows as (row: TData) => TData[] | undefined,
    getRowCanExpand: expandable?.getRowCanExpand,
    enableRowSelection: selection?.enableRowSelection ?? false,
    enableMultiRowSelection: true,
  });

  React.useEffect(() => {
    let pageCount = 1;
    if (isServerPagination) {
      pageCount = pageCountProp ?? 0;
    } else {
      pageCount = Math.ceil((table.getRowCount() || 0) / paginationState.pageSize) || 1;
    }
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
    paginationState,
    sorting,
    columnVisibility,
    isServerPagination,
    pageCountProp,
    table,
  ]);

  const loadingVariant = loading?.loadingVariant ?? "skeleton";
  const skeletonRows = loading?.skeletonRowCount ?? DEFAULT_SKELETON_ROW_COUNT;
  let localeEmptyText: string | undefined = undefined;
  if (typeof locale?.emptyText === "string") {
    localeEmptyText = locale.emptyText;
  }

  const emptyMsg = empty?.emptyMessage ?? localeEmptyText ?? DEFAULT_EMPTY_MESSAGE;
  const visibleColumns = table.getVisibleLeafColumns().length;
  const sizeClasses = SIZE_CLASSES[size];
  const currentPageData = table.getRowModel().rows.map((r) => r.original);
  let titleNode: React.ReactNode = null;
  if (typeof title === "function") {
    titleNode = title(currentPageData);
  } else if (title != null) {
    titleNode = title;
  }

  let footerNode: React.ReactNode = null;
  if (typeof footer === "function") {
    footerNode = footer(currentPageData);
  } else if (footer != null) {
    footerNode = footer;
  }

  const scrollStyle = React.useMemo<React.CSSProperties>(
    () => {
      const baseStyle: React.CSSProperties = {
        height: "auto",
        minHeight: 0,
        maxHeight: resolvedScrollHeight,
      };

      if (scrollX != null && scrollX !== true) {
        let minWidth: string = String(scrollX);
        if (typeof scrollX === "number") {
          minWidth = `${scrollX}px`;
        }
        return { ...baseStyle, minWidth };
      }

      return baseStyle;
    },
    [scrollX, resolvedScrollHeight]
  );

  return {
    table,
    scrollRef,
    shadow,
    resolvedScrollHeight,
    scrollStyle,
    sizeClasses,
    emptyMsg,
    titleNode,
    footerNode,
    loadingVariant,
    skeletonRows,
    visibleColumns,
    isServerPagination,
  };
}
