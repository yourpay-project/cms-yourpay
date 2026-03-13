import { flexRender } from '@tanstack/react-table';

import { TableHead, TableHeader, TableRow } from '@/shared/ui';

import type { DataTableInstance } from '../model';

/** Props for rendering the table header from a TanStack Table instance. */
export interface DataTableHeadProps<TData> {
  table: DataTableInstance<TData>;
}

/** Renders table header rows from the table instance's header groups. */
export function DataTableHead<TData>({ table }: DataTableHeadProps<TData>): JSX.Element {
  return (
    <TableHeader className="sticky top-0 z-20 bg-card">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            if (header.isPlaceholder) {
              return null;
            }

            return (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
