import * as React from "react";
import { cn } from "@/shared/lib/utils";

/** Props for the selection column header (select-all checkbox). */
export interface SelectionHeaderProps {
  table: {
    getIsAllPageRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void;
  };
}

/**
 * Header cell for the selection column: select-all checkbox.
 *
 * @param props - {@link SelectionHeaderProps}
 * @returns Checkbox to select/deselect all rows on the page
 */
export function SelectionHeader({ table }: SelectionHeaderProps): React.ReactElement {
  const isAllSelected = table.getIsAllPageRowsSelected();
  const isSomeSelected = table.getIsSomePageRowsSelected();
  const toggleHandler = table.getToggleAllPageRowsSelectedHandler();
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        aria-label="Select all rows on page"
        checked={isAllSelected}
        ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
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

/** Props for the selection column cell (per-row checkbox). */
export interface SelectionCellProps {
  row: {
    getCanSelect: () => boolean;
    getIsSelected: () => boolean;
    getToggleSelectedHandler: () => (event: unknown) => void;
  };
}

/**
 * Cell for the selection column: per-row checkbox.
 *
 * @param props - {@link SelectionCellProps}
 * @returns Checkbox to select/deselect the row, or a dash when row is not selectable
 */
export function SelectionCell({ row }: SelectionCellProps): React.ReactElement | null {
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
