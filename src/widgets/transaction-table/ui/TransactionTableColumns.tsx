import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/entities/transaction";

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

export function getTransactionTableColumns(): ColumnDef<Transaction, unknown>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: "Transaction ID",
      minSize: 220,
      cell: ({ getValue }) => <span className="font-medium">{valueOrDash(getValue<string>())}</span>,
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
        const badgeClass =
          STATUS_BADGE_CLASS[normalized] ?? "bg-muted text-muted-foreground border border-border";
        return (
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
            {raw}
          </span>
        );
      },
    },
  ];
}
