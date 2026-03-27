import { Button } from '@/shared/ui';

/** Props for the pagination bar (page info text + First/Prev/Next/Last buttons). */
export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  rowCount?: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

/** Pagination UI: "Page X of Y" and First / Previous / Next / Last buttons. */
export function DataTablePagination({
  currentPage,
  totalPages,
  rowCount,
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: DataTablePaginationProps): React.JSX.Element {
  let pageInfoNode: React.ReactNode = (
    <span>
      Page {currentPage} of {totalPages || 1}
    </span>
  );
  if (rowCount != null) {
    pageInfoNode = (
      <span>
        Page {currentPage} of {totalPages || 1} · {rowCount} rows
      </span>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">{pageInfoNode}</div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFirstPage}
          disabled={!canPreviousPage}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!canNextPage}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLastPage}
          disabled={!canNextPage}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
