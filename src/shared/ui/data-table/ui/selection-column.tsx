import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/shared/lib/utils";

export const SELECTION_COLUMN_ID = "select";

interface SelectionHeaderProps {
  table: { getIsAllPageRowsSelected: () => boolean; getIsSomePageRowsSelected: () => boolean; getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void };
}

function SelectionHeader({ table }: SelectionHeaderProps): React.ReactElement {
  const isAllSelected = table.getIsAllPageRowsSelected();
  const isSomeSelected = table.getIsSomePageRowsSelected();
  const toggleHandler = table.getToggleAllPageRowsSelectedHandler();
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        aria-label="Select all rows on page"
        checked={isAllSelected}
        ref={(el) => el && (el.indeterminate = isSomeSelected)}
        onChange={toggleHandler as (e: React.ChangeEvent<HTMLInputElement>) => void}
        className={cn(
          "h-4 w-4 rounded border-border bg-background text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
    </div>
  );
}

interface SelectionCellProps {
  row: { getCanSelect: () => boolean; getIsSelected: () => boolean; getToggleSelectedHandler: () => (event: unknown) => void };
}

function SelectionCell({ row }: SelectionCellProps): React.ReactElement | null {
  const canSelect = row.getCanSelect();
  const isSelected = row.getIsSelected();
  const toggleHandler = row.getToggleSelectedHandler();
  if (!canSelect) {
    return (
      <div className="flex justify-center" aria-hidden>
        <span className="text-muted-foreground/50">—</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        aria-label="Select row"
        checked={isSelected}
        onChange={toggleHandler as (e: React.ChangeEvent<HTMLInputElement>) => void}
        className={cn(
          "h-4 w-4 rounded border-border bg-background text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
    </div>
  );
}

/**
 * Returns a TanStack column definition for the row selection checkbox column.
 * Add to your columns array and use initialColumnPinning.left: ["select"] to freeze it.
 * Checkbox uses border-border, bg-background, text-primary (semantic tokens).
 *
 * @returns ColumnDef with id "select", header (select all), cell (per-row checkbox)
 */
export function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: SELECTION_COLUMN_ID,
    header: ({ table }) => <SelectionHeader table={table} />,
    cell: ({ row }) => <SelectionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  };
}
