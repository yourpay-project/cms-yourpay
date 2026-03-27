import * as React from "react";
import type { DataTableBodyProps } from "./data-table-body.type";
import { DataTableBodyRow } from "./DataTableBodyRow";
import { getFirstRightPinnedColumnId } from "./data-table-body-view-model";

/**
 * Renders table body (tbody) with optional colSpan/rowSpan, expandable rows,
 * and scroll shadow on pinned cells. Shows LoadingComponent when isLoading,
 * EmptyComponent when there are no rows, otherwise maps rows and cells.
 *
 * @param props - {@link DataTableBodyProps}
 * @returns tbody element
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
  const firstRightPinnedId = getFirstRightPinnedColumnId(rows);

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
      {rows.map((row) => (
        <DataTableBodyRow
          key={row.id}
          row={row}
          colSpan={colSpan}
          firstRightPinnedId={firstRightPinnedId}
          showLeft={showLeft}
          showRight={showRight}
          onCell={onCell}
          onRow={onRow}
          expandedRowRender={expandedRowRender}
          rowClassName={rowClassName}
          rowHoverable={rowHoverable}
          sizeCellClass={sizeCellClass}
        />
      ))}
    </tbody>
  );
}
