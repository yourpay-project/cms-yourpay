import { flexRender } from '@tanstack/react-table';

import { TableBody, TableCell, TableRow } from '@/shared/ui';

import type { DataTableInstance } from '../model';

/** Props for rendering the table body; `columnCount` is used for the empty-state colspan. */
export interface DataTableBodyProps<TData> {
  table: DataTableInstance<TData>;
  columnCount: number;
}

/** Renders table body rows or a single "No data to display" row when empty. */
export function DataTableBody<TData>({
  table,
  columnCount,
}: DataTableBodyProps<TData>): React.JSX.Element {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columnCount}
            className="h-24 text-center text-muted-foreground"
          >
            No data to display
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? 'selected' : undefined}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
