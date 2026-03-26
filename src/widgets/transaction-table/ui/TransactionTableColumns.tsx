import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import type { Transaction } from "@/entities/transaction";
import { Button } from "@/shared/ui";
import { TransactionIdCell } from "./TransactionIdCell";
import { TransactionIdHeader } from "./TransactionIdHeader";
import { getTransactionStatusBadgeClassName, valueOrDash } from "../index";

/** Builds transactions table columns with copy + actions affordances. */
export function getTransactionTableColumns(): ColumnDef<Transaction, unknown>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: () => <TransactionIdHeader />,
      minSize: 220,
      cell: ({ getValue }) => {
        return <TransactionIdCell id={getValue<string>()} />;
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
        const badgeClass = getTransactionStatusBadgeClassName(raw);
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
