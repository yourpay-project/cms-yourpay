import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { getPinningStyles } from "../lib/table-utils";
import type { ScrollShadowState } from "../lib/table-utils";
import { cn } from "@/shared/lib/utils";
import type { Table } from "@tanstack/react-table";

/**
 * Props for {@link DataTableHeader}.
 */
export interface DataTableHeaderProps<TData> {
  /** TanStack Table instance (for header groups and columns). */
  table: Table<TData>;
  /** When false, the component returns null. */
  showHeader: boolean;
  /** Tailwind classes for header cell padding (e.g. from SIZE_CLASSES[size].header). */
  sizeHeaderClass: string;
  /** Scroll shadow flags for left/right/top shadows on pinned and sticky header. */
  shadow: ScrollShadowState;
  /** When true, applies data-table-shadow-top when shadow.showTop is true. */
  enableVerticalShadow?: boolean;
}

/**
 * Renders the table header (thead) with sticky positioning, column pinning styles,
 * and optional vertical/horizontal scroll shadow classes.
 *
 * @param props - {@link DataTableHeaderProps}
 * @returns TableHeader element or null when showHeader is false
 */
export function DataTableHeader<TData>({
  table,
  showHeader,
  sizeHeaderClass,
  shadow,
  enableVerticalShadow,
}: DataTableHeaderProps<TData>): React.ReactElement | null {
  if (!showHeader) return null;

  return (
    <TableHeader
      className={cn(
        "sticky top-0 z-20 border-b border-border bg-muted",
        enableVerticalShadow && shadow.showTop && "data-table-shadow-top"
      )}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="border-none hover:bg-transparent"
          role="row"
        >
          {headerGroup.headers.map((header) => {
            const isPinned = header.column.getIsPinned();
            const canSort = header.column.getCanSort();
            const sortDir = header.column.getIsSorted();
            const ariaSort =
              sortDir === false
                ? undefined
                : sortDir === "asc"
                  ? "ascending"
                  : "descending";
            const align = header.column.columnDef.meta?.align ?? "left";
            const alignClass =
              align === "center"
                ? "text-center"
                : align === "right"
                  ? "text-right"
                  : "text-left";
            return (
              <TableHead
                key={header.id}
                style={getPinningStyles(header.column, true)}
                className={cn(
                  "border-b border-border bg-muted font-semibold text-foreground",
                  sizeHeaderClass,
                  alignClass,
                  isPinned === "left" && "border-r border-border",
                  isPinned === "left" && shadow.showLeft && "data-table-shadow-left",
                  isPinned === "right" && "border-l border-border",
                  isPinned === "right" && shadow.showRight && "data-table-shadow-right"
                )}
                role="columnheader"
                aria-sort={canSort ? ariaSort : undefined}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
