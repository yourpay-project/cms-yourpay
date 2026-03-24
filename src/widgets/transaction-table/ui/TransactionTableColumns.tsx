import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { CircleHelp } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/entities/transaction";
import { Button } from "@/shared/ui";

const STATUS_BADGE_CLASS: Record<string, string> = {
  success: "bg-success/15 text-success border border-success/30",
  expired: "bg-muted text-muted-foreground border border-border",
  pending: "bg-warning/15 text-warning border border-warning/30",
  failed: "bg-destructive/15 text-destructive border border-destructive/30",
};
function valueOrDash(value: string | undefined) {
  const v = String(value ?? "").trim();
  return v || "-";
}
/** Builds transactions table columns with copy + actions affordances. */
export function getTransactionTableColumns(): ColumnDef<Transaction, unknown>[] {
  const copyTransactionId = (id: string) => {
    const value = id.trim();
    if (!value) return;
    void navigator.clipboard.writeText(value).then(() => toast.success("Transaction ID copied."), () =>
      toast.error("Failed to copy Transaction ID."),
    );
  };
  return [
    {
      id: "id",
      accessorKey: "id",
      header: () => (
        <span className="inline-flex items-center gap-1">
          <span>Transaction ID</span>
          <span className="group/tooltip relative inline-flex" aria-label="Double click a Transaction ID to copy">
            <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-normal text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100">
              Double click a Transaction ID to copy
            </span>
          </span>
        </span>
      ),
      minSize: 220,
      cell: ({ getValue }) => {
        const id = valueOrDash(getValue<string>());
        if (id === "-") return <span className="font-medium">-</span>;
        return (
          <button
            type="button"
            className="max-w-full truncate text-left font-medium hover:underline"
            onDoubleClick={() => copyTransactionId(id)}
            title="Double click to copy Transaction ID"
            aria-label={`Transaction ID ${id}. Double click to copy.`}
          >
            {id}
          </button>
        );
      },
    },
    {
      accessorKey: "externalId",
      header: "External ID",
      minSize: 160,
      cell: ({ getValue }) => valueOrDash(getValue<string>()),
    },
    {
      accessorKey: "transactionType",
      header: "Transaction Type",
      minSize: 220,
      cell: ({ row }) => {
        const name = valueOrDash(row.original.transactionType);
        const code = valueOrDash(row.original.serviceCode);
        return (
          <span className="block truncate" title={`${name} - ${code}`}>
            {name} - {code}
          </span>
        );
      },
    },
    {
      accessorKey: "country",
      header: "Country",
      size: 80,
      meta: { align: "center" as const },
      cell: ({ getValue }) => valueOrDash(getValue<string>()).toUpperCase(),
    },
    {
      accessorKey: "sender",
      header: "Sender",
      minSize: 160,
      cell: ({ getValue }) => valueOrDash(getValue<string>()),
    },
    {
      accessorKey: "senderPhone",
      header: "Sender Phone",
      minSize: 140,
      cell: ({ getValue }) => valueOrDash(getValue<string>()),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      meta: { align: "right" as const },
      minSize: 130,
      cell: ({ getValue }) => valueOrDash(getValue<string>()),
    },
    {
      accessorKey: "receiver",
      header: "Receiver",
      minSize: 140,
      cell: ({ getValue }) => valueOrDash(getValue<string>()),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      size: 110,
      minSize: 100,
      meta: { align: "center" as const },
      cell: ({ getValue }) => {
        const raw = valueOrDash(getValue<string>());
        const normalized = raw.toLowerCase();
        const badgeClass = STATUS_BADGE_CLASS[normalized] ?? "bg-muted text-muted-foreground border border-border";
        return (
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
            {raw}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 92,
      minSize: 92,
      meta: { align: "center" as const },
      cell: ({ row }) => {
        const id = row.original.id?.trim() ?? "";
        if (!id) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex justify-center">
            <Button asChild variant="default" size="sm" type="button">
              <Link to="/transactions/$id" params={{ id }} className="h-7 px-2 text-xs">
                View
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}
