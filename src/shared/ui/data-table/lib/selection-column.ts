import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { SelectionHeader, SelectionCell } from "../ui/selection-column-components";

/**
 * Column id for the selection checkbox column.
 * Use in initialColumnPinning.left/right (e.g. `["select"]`).
 */
export const SELECTION_COLUMN_ID = "select";

/**
 * Returns a TanStack column definition for the row selection checkbox column.
 * Add to your columns array and use `initialColumnPinning.left: [SELECTION_COLUMN_ID]` to freeze it.
 * Checkbox uses border-border, bg-background, text-primary (semantic tokens).
 *
 * @returns ColumnDef with id {@link SELECTION_COLUMN_ID}, header (select all), cell (per-row checkbox), enableSorting and enableHiding false
 */
export function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: SELECTION_COLUMN_ID,
    header: ({ table }) => React.createElement(SelectionHeader, { table }),
    cell: ({ row }) => React.createElement(SelectionCell, { row }),
    enableSorting: false,
    enableHiding: false,
  };
}
