import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/shared/ui";
import type { FeeConfig } from "@/entities/fee-config";

const formatCurrencyAmount = (value: number): string => {
  if (!Number.isFinite(value)) return "0.00";

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Builds `FeeConfigTable` columns (depends on callbacks).
 */
export function getFeeConfigTableColumns(params: {
  onEdit: (row: FeeConfig) => void;
  onDelete: (row: FeeConfig) => void;
}): ColumnDef<FeeConfig, unknown>[] {
  const { onEdit, onDelete } = params;

  return [
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
        if (raw === "percentage") {
          return "percentage";
        }
        return "fixed";
      },
    },
    {
      accessorKey: "feeMode",
      header: "Fee mode",
      meta: { align: "center" as const },
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "").toLowerCase();
        if (raw === "inclusive") {
          return "inclusive";
        }
        return "exclusive";
      },
    },
    {
      id: "active",
      header: "Active",
      meta: { align: "center" as const },
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        let label = "Inactive";
        let badgeClassName = "bg-muted text-muted-foreground border-border";
        if (isActive) {
          label = "Active";
          badgeClassName = "bg-success/15 text-success border border-success/30";
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
  ];
}

