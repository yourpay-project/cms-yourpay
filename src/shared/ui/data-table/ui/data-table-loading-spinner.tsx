import * as React from "react";
import { Loader2 } from "lucide-react";
import { TableCell, TableRow } from "@/shared/ui/table";

export interface DataTableLoadingSpinnerProps {
  colSpan: number;
}

/**
 * Single row with centered spinner; use when loading state should appear inside the table body.
 */
export function DataTableLoadingSpinner({
  colSpan,
}: DataTableLoadingSpinnerProps): React.ReactElement {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="h-48 border-b border-border/60 bg-background"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
          <span className="text-sm">Loading...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
