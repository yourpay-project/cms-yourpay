import * as React from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";
import { getPinningStyles } from "../lib/table-utils";
import type { TableCellProps, TableRowProps } from "../lib/data-table-types";
import { getAlignClassName, resolveEllipsisOptions } from "./data-table-body-view-model";

interface DataTableBodyRowProps<TData> {
  row: Row<TData>;
  colSpan: number;
  firstRightPinnedId: string | null;
  showLeft: boolean;
  showRight: boolean;
  onCell?: (row: Row<TData>, columnId: string) => TableCellProps | undefined;
  onRow?: (row: Row<TData>) => TableRowProps | undefined;
  expandedRowRender?: (row: Row<TData>) => React.ReactNode;
  rowClassName?: (row: Row<TData>) => string;
  rowHoverable: boolean;
  sizeCellClass?: string;
}

/**
 * Renders one data table body row with its cells and optional expanded row.
 *
 * @param props - {@link DataTableBodyRowProps}
 * @returns Row fragment with main row and optional expanded row.
 */
export function DataTableBodyRow<TData>({
  row,
  colSpan,
  firstRightPinnedId,
  showLeft,
  showRight,
  onCell,
  onRow,
  expandedRowRender,
  rowClassName,
  rowHoverable,
  sizeCellClass,
}: DataTableBodyRowProps<TData>): React.ReactElement {
  const rowProps = onRow?.(row) ?? {};
  const isExpanded = row.getCanExpand() && row.getIsExpanded();
  const isSelected = row.getIsSelected?.() === true;
  let dataState: string | undefined = undefined;
  if (isSelected) {
    dataState = "selected";
  }

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
        data-state={dataState}
      >
        {row.getVisibleCells().map((cell) => {
          const cellMeta = onCell?.(row, cell.column.id);
          const isPinned = cell.column.getIsPinned();
          if (cellMeta?.rowSpan === 0) {
            return null;
          }

          const isFirstRightPinned = isPinned === "right" && cell.column.id === firstRightPinnedId;
          const align = cell.column.columnDef.meta?.align;
          const alignClass = getAlignClassName(align);
          const ellipsisOpt = cell.column.columnDef.meta?.ellipsis;
          const { ellipsis, showTitle } = resolveEllipsisOptions(ellipsisOpt);
          const cellContent = flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          );
          let titleAttr: string | undefined = undefined;
          if (showTitle && typeof cell.getValue() === "string") {
            titleAttr = cell.getValue() as string;
          }

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
                "border-b border-border/60 bg-background text-foreground transition-colors group-hover:bg-muted",
                sizeCellClass ?? "px-4 py-3 text-sm",
                alignClass,
                ellipsis && "truncate",
                isPinned === "left" && "border-r border-border",
                isPinned === "left" && showLeft && "data-table-shadow-left",
                isPinned === "right" && "border-l border-border",
                isFirstRightPinned && showRight && "data-table-shadow-right",
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
}

