import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

/**
 * Props for {@link DataTableToolbar}.
 */
export interface DataTableToolbarProps<TData> {
  /** TanStack Table instance (selection state, invert/clear actions). */
  table: Table<TData>;
  /** When defined, shows "Invert" button and is called after invert. */
  onInvertSelection?: () => void;
  /** When defined, shows "Clear" button and is called after clear. */
  onClearSelection?: () => void;
  /** Optional class for the toolbar container. */
  className?: string;
}

/**
 * Toolbar shown when at least one row is selected: selection count, "Invert" and "Clear" actions.
 * Uses semantic tokens for buttons and text. Renders null when selectedCount is 0.
 *
 * @param props - {@link DataTableToolbarProps}
 * @returns Toolbar div or null when no rows selected
 */
export function DataTableToolbar<TData>({
  table,
  onInvertSelection,
  onClearSelection,
  className,
}: DataTableToolbarProps<TData>): React.ReactElement | null {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  const handleInvert = React.useCallback(() => {
    const selected = table.getFilteredSelectedRowModel().rows;
    const selectedIds = new Set(selected.map((r) => r.id));
    table.getRowModel().rows.forEach((row) => {
      const next = !selectedIds.has(row.id);
      row.toggleSelected(next);
    });
    onInvertSelection?.();
  }, [table, onInvertSelection]);

  const handleClear = React.useCallback(() => {
    table.resetRowSelection();
    onClearSelection?.();
  }, [table, onClearSelection]);

  if (selectedCount === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">
        {selectedCount} of {totalCount} selected
      </span>
      {onInvertSelection !== undefined && (
        <Button type="button" variant="outline" size="sm" onClick={handleInvert}>
          Invert
        </Button>
      )}
      {onClearSelection !== undefined && (
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
