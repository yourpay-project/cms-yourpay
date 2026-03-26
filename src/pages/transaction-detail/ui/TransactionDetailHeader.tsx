import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button } from "@/shared/ui";
import type { TransactionStatusVariant } from "./transaction-detail-view-model";

interface TransactionDetailHeaderProps {
  transactionType: string | undefined;
  transactionId: string | undefined;
  normalizedStatus: string;
  statusVariant: TransactionStatusVariant;
}

/**
 * Header section for transaction detail page.
 *
 * @param props - {@link TransactionDetailHeaderProps}
 * @returns Header with back action, status badge, and copy action.
 */
export const TransactionDetailHeader: FC<TransactionDetailHeaderProps> = ({
  transactionType,
  transactionId,
  normalizedStatus,
  statusVariant,
}) => {
  const copyTransactionId = () => {
    const value = transactionId ?? "";
    if (!value) {
      return;
    }
    void navigator.clipboard.writeText(value).then(() => {
      toast.success("Transaction ID copied to clipboard.");
    });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8 shrink-0">
          <Link to="/transactions" aria-label="Back to list">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="min-w-0 text-xl font-semibold leading-tight break-words">Transaction Details</h2>
      </div>

      <div className="flex w-full min-w-0 flex-col items-end gap-1 md:w-auto">
        <div className="flex w-full min-w-0 items-center justify-end gap-2 md:w-auto">
          <p className="min-w-0 truncate text-sm font-medium">{transactionType || "-"}</p>
          <span className="text-muted-foreground">-</span>
          <Badge variant={statusVariant} className="shrink-0">
            {normalizedStatus || "-"}
          </Badge>
        </div>

        <div className="flex max-w-full items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <span className="truncate font-mono" title={transactionId}>
            ID: {transactionId || "-"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Copy transaction ID"
            onClick={copyTransactionId}
            disabled={!transactionId}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

