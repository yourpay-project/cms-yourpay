import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui";

import type { KycSubmission } from "@/entities/kyc-submission";

const STATUS_BADGE_CLASS: Record<string, string> = {
  approved: "bg-success/15 text-success border border-success/30",
  pending: "bg-warning/15 text-warning border border-warning/30",
  rejected: "bg-destructive/15 text-destructive border border-destructive/30",
};

/**
 * Builds KycSubmission table columns.
 */
export function getKycSubmissionTableColumns(): ColumnDef<KycSubmission, unknown>[] {
  return [
    {
      id: "fullName",
      accessorKey: "fullname",
      header: "Full Name",
      size: 160,
      minSize: 140,
      meta: { align: "left" as const },
      cell: ({ getValue }) => (
        <span className="font-medium text-foreground">
          {String(getValue() ?? "").trim() || "-"}
        </span>
      ),
    },
    {
      accessorKey: "countryCode",
      header: "Country Code",
      meta: { align: "center" as const },
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        return v ? v.toUpperCase() : "-";
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      meta: { align: "center" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      size: 110,
      minSize: 90,
      meta: { align: "center" as const },
      cell: ({ getValue }) => {
        const raw = getValue<string | undefined>() ?? "";
        const value = raw.toLowerCase();
        const badgeClass =
          STATUS_BADGE_CLASS[value] ?? "bg-muted text-muted-foreground border-border";
        return (
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {value || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "documentType",
      header: "Document Type",
      meta: { align: "left" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      accessorKey: "uploadDate",
      header: "Upload Date",
      meta: { align: "center" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      accessorKey: "lastUpdate",
      header: "Last Update",
      meta: { align: "center" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      accessorKey: "verifiedBy",
      header: "Verified By",
      meta: { align: "left" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      accessorKey: "rejectionNote",
      header: "Rejection Note",
      meta: { align: "left" as const },
      cell: ({ getValue }) => {
        const v = String(getValue() ?? "").trim();
        return v ? (
          <span className="max-w-[200px] truncate block" title={v}>
            {v}
          </span>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "arcNumber",
      header: "ARC Number",
      meta: { align: "center" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      accessorKey: "arcExpiryDate",
      header: "ARC Expiry",
      meta: { align: "center" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      accessorKey: "reverifyStatus",
      header: "Reverify Status",
      meta: { align: "center" as const },
      cell: ({ getValue }) => String(getValue() ?? "") || "-",
    },
    {
      id: "actions",
      header: "Actions",
      size: 92,
      minSize: 92,
      meta: { align: "center" as const },
      cell: ({ row }) => {
        const id = row.original.kycHeaderId ?? row.original.id ?? "";
        if (!id) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex justify-center">
            <Button asChild variant="default" size="sm" type="button">
              <Link to="/kyc-submission/$id" params={{ id }} className="h-7 px-2 text-xs">
                View
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}

