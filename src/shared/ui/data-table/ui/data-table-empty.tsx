import * as React from "react";
import { TableCell, TableRow } from "@/shared/ui/table";
import { DEFAULT_EMPTY_MESSAGE } from "../lib/data-table-types";

export interface DataTableEmptyProps {
  colSpan: number;
  /** Custom empty component (image + text). */
  emptyComponent?: React.ReactNode;
  /** Message when emptyComponent not provided. */
  emptyMessage?: string;
}

/**
 * Single-row empty state: custom ReactNode or a short message.
 * Uses semantic tokens (text-muted-foreground, bg-background, border-border).
 *
 * @param props.colSpan - Column span for the single cell
 * @param props.emptyComponent - Optional custom content (e.g. illustration + text)
 * @param props.emptyMessage - Fallback message when emptyComponent is not provided
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
