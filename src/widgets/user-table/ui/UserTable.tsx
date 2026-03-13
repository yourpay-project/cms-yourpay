import type { FC } from "react";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, Button, ErrorBoundary } from "@/shared/ui";
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

/** Table widget for the customers page; uses shared DataTable with name frozen left, actions frozen right. */
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
        meta: { align: "left" },
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
        meta: { align: "center" },
      },
      {
        accessorKey: "userId",
        header: "User ID",
        meta: { align: "center" },
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        meta: { align: "center" },
      },
      {
        accessorKey: "isPhoneActive",
        header: "Phone Number Status",
        meta: { align: "center" },
        cell: ({ getValue }) => {
          const value = getValue<boolean | undefined>();
          const label = value ? "Active" : "Inactive";
          const badgeClassName = value
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground";

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
        meta: { align: "center" },
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>() ?? "";
          return value ? value.toUpperCase() : "-";
        },
      },
      {
        accessorKey: "nationality",
        header: "Nationality",
        meta: { align: "center" },
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>() ?? "";
          return value ? String(value).toUpperCase() : "-";
        },
      },
      {
        accessorKey: "status",
        header: "User Status",
        meta: { align: "center" },
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
            badgeClassName = "bg-muted text-muted-foreground";
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
        meta: { align: "center" },
      },
      {
        id: "actions",
        header: "",
        meta: { align: "center" },
        cell: () => (
          <div className="flex justify-center">
            <Button variant="default" size="sm" type="button">
              View
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);

  return (
    <ErrorBoundary>
      <div className="relative flex h-full flex-col">
        <DataTable<User>
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          scrollHeight="calc(100vh - 320px)"
          enableVerticalShadow
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          initialColumnPinning={{ left: ["name"], right: ["actions"] }}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) =>
            onPageChange(pagination.pageIndex, pagination.pageSize)
          }
          empty={{ emptyMessage: "No customers found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};
