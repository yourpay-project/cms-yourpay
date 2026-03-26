import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { toast } from "sonner";

export type TransactionStatusTone = "success" | "expired" | "pending" | "failed";

const STATUS_BADGE_CLASS: Record<TransactionStatusTone, string> = {
  success: "bg-success/15 text-success border border-success/30",
  expired: "bg-muted text-muted-foreground border border-border",
  pending: "bg-warning/15 text-warning border border-warning/30",
  failed: "bg-destructive/15 text-destructive border border-destructive/30",
};

const STATUS_TONE_BY_VALUE: Record<string, TransactionStatusTone> = {
  success: "success",
  expired: "expired",
  pending: "pending",
  failed: "failed",
};

/**
 * Returns a safe display fallback for empty values.
 *
 * @param value - Raw string value.
 * @returns Trimmed value or "-".
 */
export function valueOrDash(value: string | undefined): string {
  const v = String(value ?? "").trim();
  return v || "-";
}

/**
 * Copies a transaction id to clipboard and shows a toast.
 *
 * @param id - Transaction id to copy.
 */
export function copyTransactionId(id: string): void {
  const value = id.trim();
  if (!value) {
    return;
  }
  void navigator.clipboard.writeText(value).then(
    () => toast.success("Transaction ID copied."),
    () => toast.error("Failed to copy Transaction ID."),
  );
}

/**
 * Builds badge class name for transaction status.
 *
 * @param rawStatus - Raw status string.
 * @returns Class name string for badge styling.
 */
export function getTransactionStatusBadgeClassName(rawStatus: string): string {
  const normalized = rawStatus.toLowerCase();
  const tone = STATUS_TONE_BY_VALUE[normalized];
  if (tone) {
    return STATUS_BADGE_CLASS[tone];
  }
  return "bg-muted text-muted-foreground border border-border";
}

/**
 * Builds the "Transaction ID" column header with tooltip affordance.
 *
 * @returns Header node.
 */
export function getTransactionIdHeaderNode(): ReactNode {
  return (
    <span className="inline-flex items-center gap-1">
      <span>Transaction ID</span>
      <span className="group/tooltip relative inline-flex" aria-label="Double click a Transaction ID to copy">
        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-normal text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100">
          Double click a Transaction ID to copy
        </span>
      </span>
    </span>
  );
}

