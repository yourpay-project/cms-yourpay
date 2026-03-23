import type { ReactNode } from "react";
import type { Row, Table } from "@tanstack/react-table";

import type { TableCellProps, TableRowProps } from "../lib/data-table-types";
import type { ScrollShadowState } from "../lib/table-utils";
import type { DataTableSummaryConfig } from "../lib/data-table-types";

/**
 * Props for {@link DataTableScrollArea}.
 */
export interface DataTableScrollAreaProps<TData> {
  table: Table<TData>;
  scrollRef: React.RefObject<HTMLDivElement | null> | React.LegacyRef<HTMLDivElement>;
  scrollStyle: React.CSSProperties;
  /**
   * Max height of the scroll viewport (e.g. "480px"). Body content scrolls inside when it exceeds this;
   * when empty or few rows, the area is content-sized. Pass {@link TABLE_BODY_VIEWPORT_HEIGHT} for ~10 rows.
   */
  scrollHeight: string;
  bordered: boolean;
  tableLayout?: "auto" | "fixed";
  showHeader: boolean;
  sizeHeaderClass: string;
  sizeCellClass: string;
  shadow: ScrollShadowState;
  enableVerticalShadow?: boolean;
  visibleColumns: number;
  footerNode: ReactNode;
  summary?: DataTableSummaryConfig | null;
  onCell?: (row: Row<TData>, columnId: string) => TableCellProps | undefined;
  onRow?: (row: Row<TData>) => TableRowProps | undefined;
  expandedRowRender?: (row: Row<TData>) => ReactNode;
  isLoading?: boolean;
  emptyMsg: string;
  emptyComponent?: ReactNode;
  rowClassName?: (row: Row<TData>) => string;
  rowHoverable: boolean;
  LoadingComponent: React.ComponentType<{ colSpan: number }>;
  EmptyComponent: React.ComponentType<{
    colSpan: number;
    emptyComponent?: ReactNode;
    emptyMessage?: string;
  }>;
}

