import * as React from "react";
import type { Row, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/shared/ui/table";
import { getPinningStyles } from "../lib/table-utils";
import type { TableCellProps, TableRowProps } from "../lib/data-table-types";
import type { ScrollShadowState } from "../lib/table-utils";
import { cn } from "@/shared/lib/utils";

export interface DataTableBodyProps<TData> {
  table: Table<TData>;
  onCell?: (row: Row<TData>, columnId: string) => TableCellProps | undefined;
  onRow?: (row: Row<TData>) => TableRowProps | undefined;
  expandedRowRender?: (row: Row<TData>) => React.ReactNode;
  isLoading?: boolean;
  colSpan: number;
  emptyComponent?: React.ReactNode;
  emptyMessage?: string;
  /** When set, shadow is shown only when content is scrolled behind (left/right). */
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
    emptyComponent?: React.ReactNode;
    emptyMessage?: string;
  }>;
}

/**
 * Renders table body with optional colSpan/rowSpan, expandable rows, and scroll shadow on pinned cells.
 *
 * @param props.table - TanStack Table instance
 * @param props.scrollShadow - When set, left/right shadow on pinned columns only when content is scrolled behind
 * @param props.LoadingComponent - Rendered when isLoading is true
 * @param props.EmptyComponent - Rendered when there are no rows
 */
export function DataTableBody<TData>({
  table,
  onCell,
  onRow,
  expandedRowRender,
  isLoading,
  colSpan,
  emptyComponent,
  emptyMessage,
  scrollShadow,
  rowClassName,
  rowHoverable = true,
  sizeCellClass,
  LoadingComponent,
  EmptyComponent,
}: DataTableBodyProps<TData>): React.ReactElement {
  const showLeft = scrollShadow?.showLeft ?? false;
  const showRight = scrollShadow?.showRight ?? false;
  const rows = table.getRowModel().rows;

  if (isLoading) {
    return (
      <tbody>
        <LoadingComponent colSpan={colSpan} />
      </tbody>
    );
  }

  if (!rows?.length) {
    return (
      <tbody>
        <EmptyComponent
          colSpan={colSpan}
          emptyComponent={emptyComponent}
          emptyMessage={emptyMessage}
        />
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row) => {
        const rowProps = onRow?.(row) ?? {};
        const isExpanded = row.getCanExpand() && row.getIsExpanded();
        return (
          <React.Fragment key={row.id}>
            <TableRow
              className={cn(
                "group border-none transition-colors",
                rowHoverable && "hover:bg-muted/50",
                rowClassName?.(row),
                rowProps.className
              )}
              style={rowProps.style}
              onClick={rowProps.onClick}
              aria-expanded={row.getCanExpand() ? isExpanded : undefined}
              aria-selected={row.getIsSelected?.()}
              data-state={row.getIsSelected?.() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => {
                const cellMeta = onCell?.(row, cell.column.id);
                const isPinned = cell.column.getIsPinned();
                const hide = cellMeta?.rowSpan === 0;
                if (hide) return null;
                const align = cell.column.columnDef.meta?.align ?? "left";
                const alignClass =
                  align === "center"
                    ? "text-center"
                    : align === "right"
                      ? "text-right"
                      : "text-left";
                const ellipsisOpt = cell.column.columnDef.meta?.ellipsis;
                const ellipsis = ellipsisOpt === true || (typeof ellipsisOpt === "object" && ellipsisOpt != null);
                const showTitle = ellipsis && (ellipsisOpt === true || ellipsisOpt?.showTitle !== false);
                const cellContent = flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                );
                const titleAttr = showTitle && typeof cell.getValue() === "string" ? cell.getValue() as string : undefined;
                return (
                  <TableCell
                    key={cell.id}
                    colSpan={cellMeta?.colSpan}
                    rowSpan={cellMeta?.rowSpan}
                    title={titleAttr}
                    style={{
                      ...getPinningStyles(cell.column, false),
                      ...cellMeta?.style,
                    }}
                    className={cn(
                      "border-b border-border/60 bg-background text-foreground transition-colors group-hover:bg-muted/40",
                      sizeCellClass ?? "px-4 py-3 text-sm",
                      alignClass,
                      ellipsis && "truncate",
                      isPinned === "left" && "border-r border-border",
                      isPinned === "left" && showLeft && "data-table-shadow-left",
                      isPinned === "right" && "border-l border-border",
                      isPinned === "right" && showRight && "data-table-shadow-right",
                      cellMeta?.className
                    )}
                    aria-hidden={cellMeta?.["aria-hidden"]}
                  >
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
            {isExpanded && expandedRowRender && (
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableCell
                  colSpan={colSpan}
                  className="border-b border-border/60 px-4 py-2 text-sm text-foreground"
                >
                  {expandedRowRender(row)}
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}
