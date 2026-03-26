import * as React from "react";
import type { HeaderContext } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Props for {@link DataTableHeaderCell}.
 */
export interface DataTableHeaderCellProps<TData, TValue> {
  /** TanStack header context (column, header). */
  context: HeaderContext<TData, TValue>;
  /** When true (default), shows sort icon and toggle handler. */
  enableSort?: boolean;
  /** Optional filter UI (e.g. dropdown) rendered below the header label. */
  filterSlot?: React.ReactNode;
  /** Optional class for the wrapper div. */
  className?: string;
}

/**
 * Header cell with optional sort indicator (aria-sort) and filter slot.
 * Use inside columnDef.header for sortable columns. Uses text-foreground and focus-visible:ring-ring.
 *
 * @param props - {@link DataTableHeaderCellProps}
 * @returns Wrapper div with header content, sort button, and optional filterSlot
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
  let ariaSort: "ascending" | "descending" | undefined = undefined;
  if (sortDir === "asc") ariaSort = "ascending";
  else if (sortDir === "desc") ariaSort = "descending";

  let sortIcon: React.ReactNode = <ArrowUpDown className="h-4 w-4" />;
  if (sortDir === "asc") {
    sortIcon = <ArrowUp className="h-4 w-4" />;
  } else if (sortDir === "desc") {
    sortIcon = <ArrowDown className="h-4 w-4" />;
  }

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
            {sortIcon}
          </button>
        )}
      </div>
      {filterSlot && <div className="flex items-center">{filterSlot}</div>}
    </div>
  );
}
