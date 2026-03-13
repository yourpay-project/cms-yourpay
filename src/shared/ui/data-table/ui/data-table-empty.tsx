import * as React from "react";
import { TableCell, TableRow } from "@/shared/ui/table";
import { DEFAULT_EMPTY_MESSAGE } from "../lib/data-table-types";

/**
 * Props for {@link DataTableEmpty}.
 */
export interface DataTableEmptyProps {
  /** Column span for the single empty cell. */
  colSpan: number;
  /** Optional custom content (e.g. illustration + text). When provided, emptyMessage is ignored. */
  emptyComponent?: React.ReactNode;
  /** Message shown when emptyComponent is not provided (default: DEFAULT_EMPTY_MESSAGE). */
  emptyMessage?: string;
}

/**
 * Single-row empty state: one TableRow with one TableCell spanning all columns.
 * Renders emptyComponent or emptyMessage. Uses semantic tokens (text-muted-foreground, bg-background, border-border).
 *
 * @param props - {@link DataTableEmptyProps}
 * @returns Single TableRow containing the empty state cell
 */
export function DataTableEmpty({
  colSpan,
  emptyComponent,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
}: DataTableEmptyProps): React.ReactElement {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="h-40 border-b border-border/60 bg-background text-center text-sm text-muted-foreground"
      >
        {emptyComponent ?? emptyMessage}
      </TableCell>
    </TableRow>
  );
}
