import type { FC } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import {
  DataTableHead,
  DataTableBody,
  DataTablePagination,
  useDataTableInstance,
} from "@/widgets/data-table";
import { Button, ErrorBoundary, Table } from "@/shared/ui";
import type { User } from "@/entities/user";

/** Props for the customers list table; wires server-side pagination to DataTable. */
export interface UserTableProps {
  data: User[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (pageIndex: number, pageSize: number) => void;
}

/** Table widget for the customers page; uses DataTable with server-side pagination. */
export const UserTable: FC<UserTableProps> = ({
  data,
  total,
  pageIndex,
  pageSize,
  isRefetching,
  onPageChange,
}) => {
  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: ({ row }) => {
          const firstName = row.original.firstName ?? "";
          const lastName = row.original.lastName ?? "";
          const fullName = `${firstName} ${lastName}`.trim() || "-";
          return <span className="font-medium text-foreground">{fullName}</span>;
        },
      },
      {
        accessorKey: "id",
        header: "Customer ID",
      },
      {
        accessorKey: "userId",
        header: "User ID",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      {
        accessorKey: "isPhoneActive",
        header: "Phone Number Status",
        cell: ({ getValue }) => {
          const value = getValue<boolean | undefined>();
          const label = value ? "Active" : "Inactive";
          const badgeClassName = value
            ? "bg-primary/10 text-primary"
            : "bg-destructive/10 text-destructive";

          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClassName}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: "countryOfRegistration",
        header: "Country of registration",
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>() ?? "";
          return value ? value.toUpperCase() : "-";
        },
      },
      {
        accessorKey: "nationality",
        header: "Nationality",
      },
      {
        accessorKey: "status",
        header: "User Status",
        cell: ({ getValue }) => {
          const raw = getValue<string | undefined>() ?? "";
          const value = raw.toLowerCase();
          let label = "Unknown";
          let badgeClassName = "bg-muted text-muted-foreground";

          if (value === "active") {
            label = "Active";
            badgeClassName = "bg-primary/10 text-primary";
          } else if (value === "blocked") {
            label = "Blocked";
            badgeClassName = "bg-destructive/10 text-destructive";
          } else if (value === "inactive") {
            label = "Inactive";
            badgeClassName = "bg-secondary/10 text-secondary-foreground";
          }

          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClassName}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" type="button">
              View
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const {
    table,
    canPreviousPage,
    canNextPage,
    currentPage,
    totalPages,
  } = useDataTableInstance<User, unknown>({
    columns,
    data,
    initialPageSize: pageSize,
    pagination: { pageIndex, pageSize },
    onPaginationChange: (next) => onPageChange(next.pageIndex, next.pageSize),
    rowCount: total,
  });

  return (
    <ErrorBoundary>
      <div className="relative flex h-full flex-col">
        <div className="flex-1 min-h-0 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex h-full flex-col">
            <div className="flex-0 border-b border-border/60 bg-card">
              <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                  <DataTableHead table={table} />
                </Table>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <div className="min-h-full overflow-x-auto">
                <Table className="min-w-full text-sm">
                  <DataTableBody table={table} columnCount={columns.length} />
                </Table>
              </div>
            </div>

            <div className="flex-0 border-t border-border/60 bg-card px-4 py-2">
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowCount={total}
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
                onFirstPage={() => table.firstPage()}
                onPreviousPage={() => table.previousPage()}
                onNextPage={() => table.nextPage()}
                onLastPage={() => table.lastPage()}
              />
            </div>
          </div>
        </div>

        {isRefetching && data.length > 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
              Loading latest customers...
            </span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

