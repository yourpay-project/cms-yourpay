import * as React from "react";
import type { HeaderContext } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface DataTableHeaderCellProps<TData, TValue> {
  context: HeaderContext<TData, TValue>;
  /** Optional: show sort indicator. */
  enableSort?: boolean;
  /** Optional: custom filter slot (dropdown, etc.). */
  filterSlot?: React.ReactNode;
  className?: string;
}

/**
 * Header cell with optional sort indicator (aria-sort) and filter slot.
 * Use inside columnDef.header for sortable columns. Uses text-foreground and focus-visible:ring-ring.
 *
 * @param props.context - TanStack header context
 * @param props.enableSort - Whether to show sort icon and handle (default true)
 * @param props.filterSlot - Optional filter UI (e.g. dropdown) below the header label
 */
export function DataTableHeaderCell<TData, TValue>({
  context,
  enableSort = true,
  filterSlot,
  className,
}: DataTableHeaderCellProps<TData, TValue>): React.ReactElement {
  const { column, header } = context;
  const canSort = column.getCanSort();
  const sortDir = column.getIsSorted();
  const ariaSort =
    sortDir === false ? undefined : sortDir === "asc" ? "ascending" : "descending";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-1">
        {header.isPlaceholder ? null : flexRender(column.columnDef.header, context)}
        {enableSort && canSort && (
          <button
            type="button"
            onClick={column.getToggleSortingHandler()}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={sortDir ? `Sort ${sortDir}` : "Sort"}
            aria-sort={ariaSort}
          >
            {sortDir === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : sortDir === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {filterSlot && <div className="flex items-center">{filterSlot}</div>}
    </div>
  );
}
