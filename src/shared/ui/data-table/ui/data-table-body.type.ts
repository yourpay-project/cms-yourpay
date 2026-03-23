import type { ReactNode } from "react";
import type { Row, Table } from "@tanstack/react-table";

import type { TableCellProps, TableRowProps } from "../lib/data-table-types";
import type { ScrollShadowState } from "../lib/table-utils";

/**
 * Props for {@link DataTableBody}.
 */
export interface DataTableBodyProps<TData> {
  table: Table<TData>;
  onCell?: (row: Row<TData>, columnId: string) => TableCellProps | undefined;
  onRow?: (row: Row<TData>) => TableRowProps | undefined;
  expandedRowRender?: (row: Row<TData>) => ReactNode;
  isLoading?: boolean;
  colSpan: number;
  emptyComponent?: ReactNode;
  emptyMessage?: string;
  /** When set, left/right shadow on pinned columns when content is scrolled behind. */
  scrollShadow?: ScrollShadowState;
  /** Row class name from rowClassName(row). AntD rowClassName. */
  rowClassName?: (row: Row<TData>) => string;
  /** Whether rows have hover style. */
  rowHoverable?: boolean;
  /** Tailwind class for cell padding/size (e.g. from SIZE_CLASSES.cell). */
  sizeCellClass?: string;
  LoadingComponent: React.ComponentType<{ colSpan: number }>;
  EmptyComponent: React.ComponentType<{
    colSpan: number;
    emptyComponent?: ReactNode;
    emptyMessage?: string;
  }>;
}

