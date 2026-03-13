import * as React from "react";
import { TableCell, TableRow } from "@/shared/ui/table";
import { DEFAULT_SKELETON_ROW_COUNT } from "../lib/table-utils";

/**
 * Props for {@link DataTableLoadingOverlay}.
 */
export interface DataTableLoadingOverlayProps {
  /** Column span for each skeleton row. */
  colSpan: number;
  /** Number of skeleton rows (default: DEFAULT_SKELETON_ROW_COUNT). */
  rowCount?: number;
}

/**
 * Skeleton rows shown while data is loading. Each row has one cell with an animated pulse bar (bg-muted).
 * Used when DataTable loading.loadingVariant is "skeleton".
 *
 * @param props - {@link DataTableLoadingOverlayProps}
 * @returns Fragment of TableRow elements (skeleton rows)
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
