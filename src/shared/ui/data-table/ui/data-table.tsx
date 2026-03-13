import * as React from "react";
import { useDataTable } from "../lib/use-data-table";
import type { DataTableProps as DataTablePropsType } from "../lib/data-table-types";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableScrollArea } from "./data-table-scroll-area";
import { DataTableLoadingOverlay } from "./data-table-loading-overlay";
import { DataTableLoadingSpinner } from "./data-table-loading-spinner";
import { DataTableEmpty } from "./data-table-empty";

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
 * @param props - {@link DataTableProps}
 * @returns Root div containing optional toolbar, title, {@link DataTableScrollArea}, and pagination
 */
export function DataTable<TData, TValue = unknown>(
  props: DataTablePropsType<TData, TValue>
): React.ReactElement {
  const {
    showHeader = true,
    showPagination = true,
    bordered = true,
    tableLayout,
    enableVerticalShadow,
    selection,
    expandable,
    summary,
    empty,
    onCell,
    onRow,
    pageSizeOptions,
  } = props;

  const {
    table,
    scrollRef,
    shadow,
    scrollStyle,
    sizeClasses,
    emptyMsg,
    titleNode,
    footerNode,
    loadingVariant,
    skeletonRows,
    visibleColumns,
  } = useDataTable(props);

  const LoadingComponent = React.useCallback(
    (loadProps: { colSpan: number }) =>
      loadingVariant === "spinner" ? (
        <DataTableLoadingSpinner colSpan={loadProps.colSpan} />
      ) : (
        <DataTableLoadingOverlay
          colSpan={loadProps.colSpan}
          rowCount={skeletonRows}
        />
      ),
    [loadingVariant, skeletonRows]
  );

  const EmptyComponent = React.useCallback(
    (emptyProps: {
      colSpan: number;
      emptyComponent?: React.ReactNode;
      emptyMessage?: string;
    }) => (
      <DataTableEmpty
        colSpan={emptyProps.colSpan}
        emptyComponent={emptyProps.emptyComponent}
        emptyMessage={emptyProps.emptyMessage}
      />
    ),
    []
  );

  return (
    <div className="flex w-full flex-col gap-4" role="grid" aria-label="Data table">
      {selection?.showSelectionActions && (
        <DataTableToolbar table={table} />
      )}
      {titleNode != null && (
        <div className="text-sm font-medium text-foreground">{titleNode}</div>
      )}
      <DataTableScrollArea<TData>
        table={table}
        scrollRef={scrollRef}
        scrollStyle={scrollStyle}
        bordered={bordered}
        tableLayout={tableLayout}
        showHeader={showHeader}
        sizeHeaderClass={sizeClasses.header}
        sizeCellClass={sizeClasses.cell}
        shadow={shadow}
        enableVerticalShadow={enableVerticalShadow}
        visibleColumns={visibleColumns}
        footerNode={footerNode}
        summary={summary ?? null}
        onCell={onCell}
        onRow={onRow}
        expandedRowRender={expandable?.expandedRowRender}
        isLoading={props.isLoading}
        emptyMsg={emptyMsg}
        emptyComponent={empty?.emptyComponent}
        rowClassName={props.rowClassName}
        rowHoverable={props.rowHoverable ?? true}
        LoadingComponent={LoadingComponent}
        EmptyComponent={EmptyComponent}
      />
      {showPagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}

export type { DataTablePropsType as DataTableProps };
