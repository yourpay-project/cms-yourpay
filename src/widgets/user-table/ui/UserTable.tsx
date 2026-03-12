import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';

import { DataTable } from '@/widgets/data-table';
import { ErrorBoundary } from '@/shared/ui';
import type { User } from '@/entities/user';

/** Props for the user list table; wires server-side pagination to DataTable. */
export interface UserTableProps {
  data: User[];
  total: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number, pageSize: number) => void;
}

/** Table widget for the user list page; uses DataTable with server-side pagination. */
export const UserTable = ({
  data,
  total,
  pageIndex,
  pageSize,
  onPageChange,
}: UserTableProps) => {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    [],
  );

  return (
    <ErrorBoundary>
      <DataTable
        columns={columns}
        data={data}
        pagination={{ pageIndex, pageSize }}
        onPaginationChange={(next: PaginationState) =>
          onPageChange(next.pageIndex, next.pageSize)
        }
        rowCount={total}
      />
    </ErrorBoundary>
  );
};

