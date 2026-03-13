import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/shared/ui/table";
import { getPinningStyles } from "../lib/table-utils";
import { cn } from "@/shared/lib/utils";

/**
 * Props for {@link DataTableSummary}.
 */
export interface DataTableSummaryProps<TData> {
  /** TanStack Table instance (visible leaf columns for layout). */
  table: Table<TData>;
  /** Summary rows: array of objects keyed by column id. */
  summaryRows: Record<string, unknown>[];
  /** Optional renderer: (columnId, summaryRow, columnIndex) => ReactNode. */
  renderSummaryCell?: (
    columnId: string,
    summaryRow: Record<string, unknown>,
    columnIndex: number
  ) => React.ReactNode;
  /** Optional class for summary rows. */
  className?: string;
}

/**
 * Sticky footer row(s) for totals or aggregates. Uses bg-muted/70 and border-border.
 * Applies getPinningStyles to summary cells for alignment with pinned columns.
 *
 * @param props - {@link DataTableSummaryProps}
 * @returns Fragment of TableRow elements (one per summary row)
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
