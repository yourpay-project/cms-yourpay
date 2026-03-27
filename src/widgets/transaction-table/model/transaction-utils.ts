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

