import type { FC } from "react";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, ErrorBoundary, TABLE_BODY_VIEWPORT_HEIGHT, Button } from "@/shared/ui";
import type { Country } from "@/entities/country";

export interface CountriesTableProps {
  data: Country[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (pageIndex: number, pageSize: number) => void;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: "bg-success/15 text-success border border-success/30",
  inactive: "bg-destructive/15 text-destructive border border-destructive/30",
};

export const CountriesTable: FC<CountriesTableProps> = (props) => {
  const { data, total, pageIndex, pageSize, isRefetching, onPageChange, onEdit, onDelete } = props;
  const columns = useMemo<ColumnDef<Country, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Country Name",
        size: 220,
        minSize: 180,
        meta: { align: "left" as const },
        cell: ({ getValue }) => {
          const v = String(getValue() ?? "").trim();
          return v || "-";
        },
      },
      {
        accessorKey: "code",
        header: "Code",
        size: 80,
        minSize: 70,
        meta: { align: "center" as const },
        cell: ({ getValue }) => {
          const v = String(getValue() ?? "").trim();
          if (v) {
            return v.toUpperCase();
          }
          return "-";
        },
      },
      {
        id: "status",
        header: "Status",
        meta: { align: "center" as const },
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          let key = "inactive";
          if (isActive) {
            key = "active";
          }
          const badgeClass =
            STATUS_BADGE_CLASS[key] ?? "bg-muted text-muted-foreground border-border";

          let statusLabel = "Inactive";
          if (isActive) {
            statusLabel = "Active";
          }

          return (
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
            >
              {statusLabel}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        meta: { align: "center" as const },
        cell: ({ row }) => {
          const country = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(country)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(country)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [onDelete, onEdit],
  );

  let pageCount = Math.ceil(total / pageSize);
  if (total === 0) {
    pageCount = 1;
  }

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col">
        <DataTable<Country>
          columns={columns}
          data={data}
          getRowId={(row) => row.code}
          scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
          enableVerticalShadow
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) =>
            onPageChange(pagination.pageIndex, pagination.pageSize)
          }
          empty={{ emptyMessage: "No countries found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};

