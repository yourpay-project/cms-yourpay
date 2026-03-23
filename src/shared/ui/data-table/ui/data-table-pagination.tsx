import type { Table } from "@tanstack/react-table";
import { useId } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SelectDropdown } from "@/shared/ui";
import { PAGE_SIZE_OPTIONS } from "../lib/table-utils";
import { cn } from "@/shared/lib/utils";

/**
 * Props for {@link DataTablePagination}.
 */
export interface DataTablePaginationProps<TData> {
  /** TanStack Table instance (state.pagination, setPageIndex, setPageSize, getPageCount). */
  table: Table<TData>;
  /** Override default page size options (default: PAGE_SIZE_OPTIONS [10, 20, 30, 40, 50]). */
  pageSizeOptions?: readonly number[];
  /** When false, hides "X of Y row(s) selected." (e.g. when table does not use selection). */
  showSelectionCount?: boolean;
}

/**
 * AntD-style pagination: rows per page selector, first/prev/next/last buttons, page indicator.
 * Uses semantic tokens (text-foreground, border-input, bg-background) for light/dark theme.
 *
 * @param props - {@link DataTablePaginationProps}
 * @returns Pagination bar with selection count, rows-per-page select, and navigation buttons
 */
const DEFAULT_PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showSelectionCount = true,
}: DataTablePaginationProps<TData>): React.ReactElement {
  // `useId()` contains `:` in React 18, which some a11y engines may fail to match reliably.
  const selectId = useId().replace(/:/g, "");
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2">
      {showSelectionCount && (
        <div className="text-sm text-muted-foreground">
          {selectedCount} of {totalCount} row(s) selected.
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-4 lg:gap-6",
          !showSelectionCount && "ml-auto"
        )}
      >
        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="text-sm font-medium text-foreground">
            Rows per page
          </label>
          <div className="w-[8.5rem]">
            <SelectDropdown
              id={selectId}
              value={String(pageSize)}
              onChange={(v) => table.setPageSize(Number(v))}
              options={pageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))}
              allowClear={false}
              searchable={false}
              placeholder={String(pageSize)}
              size="sm"
            />
          </div>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-foreground">
          Page {pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
