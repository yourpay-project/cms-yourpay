import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/shared/ui/table";
import { getPinningStyles } from "../lib/table-utils";
import { cn } from "@/shared/lib/utils";

export interface DataTableSummaryProps<TData> {
  table: Table<TData>;
  /** Summary rows (objects keyed by column id or index). */
  summaryRows: Record<string, unknown>[];
  /** Render cell (columnId, summaryRow, columnIndex) => ReactNode. */
  renderSummaryCell?: (
    columnId: string,
    summaryRow: Record<string, unknown>,
    columnIndex: number
  ) => React.ReactNode;
  className?: string;
}

/**
 * Sticky footer row(s) for totals or aggregates. Uses bg-muted/70 and border-border.
 *
 * @param props.table - TanStack Table instance (visible columns)
 * @param props.summaryRows - Array of row objects keyed by column id
 * @param props.renderSummaryCell - Optional (columnId, summaryRow, columnIndex) => ReactNode
 */
export function DataTableSummary<TData>({
  table,
  summaryRows,
  renderSummaryCell,
  className,
}: DataTableSummaryProps<TData>): React.ReactElement {
  const visibleColumns = table.getVisibleLeafColumns();
  const defaultRender = (colId: string, row: Record<string, unknown>): React.ReactNode =>
    row[colId] != null ? String(row[colId]) : null;

  const render = renderSummaryCell ?? defaultRender;

  return (
    <>
      {summaryRows.map((summaryRow, rowIndex) => (
        <TableRow
          key={`summary-${rowIndex}`}
          className={cn(
            "sticky bottom-0 z-10 border-t-2 border-border bg-muted/70 font-medium text-foreground hover:bg-muted/70",
            className
          )}
        >
          {visibleColumns.map((column, colIndex) => (
            <TableCell
              key={column.id}
              style={getPinningStyles(column, true)}
              className={cn(
                "border-r border-border/60 px-4 py-3 text-sm last:border-r-0",
                column.getIsPinned() === "left" &&
                  "border-r shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]",
                column.getIsPinned() === "right" &&
                  "border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]"
              )}
            >
              {render(column.id, summaryRow, colIndex)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
