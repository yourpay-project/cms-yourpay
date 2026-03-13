import * as React from "react";
import { TableCell, TableRow } from "@/shared/ui/table";
import { DEFAULT_SKELETON_ROW_COUNT } from "../lib/table-utils";

export interface DataTableLoadingOverlayProps {
  colSpan: number;
  rowCount?: number;
}

/**
 * Skeleton rows shown while data is loading. Uses bg-muted for the animated bar.
 *
 * @param props.colSpan - Column span for each skeleton row
 * @param props.rowCount - Number of skeleton rows (default from DEFAULT_SKELETON_ROW_COUNT)
 */
export function DataTableLoadingOverlay({
  colSpan,
  rowCount = DEFAULT_SKELETON_ROW_COUNT,
}: DataTableLoadingOverlayProps): React.ReactElement {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
          <TableCell
            colSpan={colSpan}
            className="h-14 border-b border-border/60 bg-background px-4 py-3"
          >
            <div className="h-5 w-full max-w-xs animate-pulse rounded-md bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
