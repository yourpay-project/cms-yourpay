import type { FC } from "react";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, ErrorBoundary, TABLE_BODY_VIEWPORT_HEIGHT, Button } from "@/shared/ui";
import type { FeeConfig } from "@/entities/fee-config";

export interface FeeConfigTableProps {
  data: FeeConfig[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (pageIndex: number, pageSize: number) => void;
  onEdit: (row: FeeConfig) => void;
  onDelete: (row: FeeConfig) => void;
}

const formatCurrencyAmount = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "0.00";
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const FeeConfigTable: FC<FeeConfigTableProps> = ({
  data,
  total,
  pageIndex,
  pageSize,
  isRefetching,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns = useMemo<ColumnDef<FeeConfig, unknown>[]>(
    () => [
      {
        accessorKey: "nominal",
        header: "Nominal",
        meta: { align: "right" as const },
        cell: ({ getValue }) => {
          const value = Number(getValue() ?? 0);
          return <span className="tabular-nums">{formatCurrencyAmount(value)}</span>;
        },
      },
      {
        accessorKey: "service",
        header: "Service",
        meta: { align: "left" as const },
      },
      {
        accessorKey: "currency",
        header: "Currency",
        meta: { align: "center" as const },
        cell: ({ getValue }) => {
          const value = String(getValue() ?? "").toUpperCase();
          return value || "-";
        },
      },
      {
        accessorKey: "feeType",
        header: "Fee type",
        meta: { align: "center" as const },
        cell: ({ getValue }) => {
          const raw = String(getValue() ?? "").toLowerCase();
          return raw === "percentage" ? "percentage" : "fixed";
        },
      },
      {
        accessorKey: "feeMode",
        header: "Fee mode",
        meta: { align: "center" as const },
        cell: ({ getValue }) => {
          const raw = String(getValue() ?? "").toLowerCase();
          return raw === "inclusive" ? "inclusive" : "exclusive";
        },
      },
      {
        id: "active",
        header: "Active",
        meta: { align: "center" as const },
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          const label = isActive ? "Active" : "Inactive";
          const badgeClassName = isActive
            ? "bg-success/15 text-success border border-success/30"
            : "bg-muted text-muted-foreground border-border";

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
        id: "actions",
        header: "Actions",
        meta: { align: "center" as const },
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => onEdit(item)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => onDelete(item)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete],
  );

  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col">
        <DataTable<FeeConfig>
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
          enableVerticalShadow
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          initialColumnPinning={{ left: ["service"], right: ["actions"] }}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) =>
            onPageChange(pagination.pageIndex, pagination.pageSize)
          }
          empty={{ emptyMessage: "No fee configurations found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};

