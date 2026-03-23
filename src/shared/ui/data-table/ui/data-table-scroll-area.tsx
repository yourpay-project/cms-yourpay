import * as React from "react";
import { Table as TablePrimitive, TableCell, TableRow } from "@/shared/ui/table";
import { DataTableHeader } from "./data-table-header";
import { DataTableBody } from "./data-table-body";
import { DataTableSummary } from "./data-table-summary";
import { cn } from "@/shared/lib/utils";
import type { DataTableScrollAreaProps } from "./data-table-scroll-area.type";

/**
 * Scrollable table container: scroll wrapper, table with header/body/footers,
 * and fixed bottom shadow overlay. The bottom shadow is rendered outside the scroll
 * div so it does not move when content scrolls.
 *
 * Viewport height is capped by `scrollHeight` (maxHeight); when content is empty or short,
 * the area stays content-sized. When content exceeds `scrollHeight`, it scrolls inside.
 *
 * @param props - {@link DataTableScrollAreaProps}
 * @returns Wrapper div containing scroll div (table) and optional bottom shadow overlay
 */
export function DataTableScrollArea<TData>({
  table,
  scrollRef,
  scrollStyle,
  scrollHeight,
  bordered,
  tableLayout,
  showHeader,
  sizeHeaderClass,
  sizeCellClass,
  shadow,
  enableVerticalShadow,
  visibleColumns,
  footerNode,
  summary,
  onCell,
  onRow,
  expandedRowRender,
  isLoading,
  emptyMsg,
  emptyComponent,
  rowClassName,
  rowHoverable,
  LoadingComponent,
  EmptyComponent,
}: DataTableScrollAreaProps<TData>): React.ReactElement {
  return (
    <div
      className="relative flex w-full flex-none flex-col overflow-hidden [&>div]:min-h-0"
      style={{ maxHeight: scrollHeight }}
    >
      <div
        ref={scrollRef as React.LegacyRef<HTMLDivElement>}
        className={cn(
          "custom-scrollbar w-full self-start overflow-auto rounded-lg border border-border bg-card",
          bordered && "border"
        )}
        style={scrollStyle}
      >
        <TablePrimitive
          className={cn(
            "min-w-max border-separate border-spacing-0 text-foreground",
            tableLayout === "fixed" && "table-fixed"
          )}
          style={tableLayout === "fixed" ? { tableLayout: "fixed" } : undefined}
          role="grid"
        >
          <DataTableHeader<TData>
            table={table}
            showHeader={showHeader}
            sizeHeaderClass={sizeHeaderClass}
            shadow={shadow}
            enableVerticalShadow={enableVerticalShadow}
          />
          <DataTableBody<TData>
            table={table}
            onCell={onCell}
            onRow={onRow}
            expandedRowRender={expandedRowRender}
            isLoading={isLoading}
            colSpan={visibleColumns}
            scrollShadow={shadow}
            emptyComponent={emptyComponent}
            emptyMessage={emptyMsg}
            rowClassName={rowClassName}
            rowHoverable={rowHoverable}
            sizeCellClass={sizeCellClass}
            LoadingComponent={LoadingComponent}
            EmptyComponent={EmptyComponent}
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
        </TablePrimitive>
      </div>
      {enableVerticalShadow && shadow.showBottom && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 rounded-b-lg"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--foreground) / 0.08), transparent)",
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
