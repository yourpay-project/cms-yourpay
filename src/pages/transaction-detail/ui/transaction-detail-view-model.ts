import type { TransactionDetail } from "@/entities/transaction";
import { ApiClientError } from "@/shared/api";
import { formatDisplayDateTime } from "@/shared/lib";

export type TransactionStatusVariant = "success" | "warning" | "destructive" | "default";

export interface TransactionDetailFieldItem {
  label: string;
  value: string | undefined;
}

export interface TransactionDetailSectionItem {
  title: string;
  fields: TransactionDetailFieldItem[];
  fullWidthFields?: TransactionDetailFieldItem[];
}

const STATUS_VARIANT_BY_STATUS: Record<string, TransactionStatusVariant> = {
  SUCCESS: "success",
  COMPLETED: "success",
  PENDING: "warning",
  PROCESSING: "warning",
  FAILED: "destructive",
  REVERSED: "destructive",
  CANCELLED: "destructive",
};

/**
 * Maps transaction status to badge variant.
 *
 * @param status - Raw transaction status.
 * @returns Badge variant for UI status display.
 */
export function getTransactionStatusVariant(status: string | undefined): TransactionStatusVariant {
  const normalizedStatus = String(status ?? "").trim().toUpperCase();
  return STATUS_VARIANT_BY_STATUS[normalizedStatus] ?? "default";
}

/**
 * Maps transaction detail query error to user-facing message.
 *
 * @param error - Query error object.
 * @returns Safe message for detail page error state.
 */
export function getTransactionDetailErrorMessage(error: unknown): string {
  const apiError = error instanceof ApiClientError ? error : null;
  if (apiError?.status === 404) {
    return "Transaction detail not found.";
  }
  return "Failed to load transaction detail.";
}

/**
 * Builds the detail card section model for transaction detail page.
 *
 * @param detail - Transaction detail payload.
 * @returns Ordered list of sections and fields for rendering.
 */
export function buildTransactionDetailSections(
  detail: TransactionDetail,
): TransactionDetailSectionItem[] {
  return [
    {
      title: "Basic Information",
      fields: [
        { label: "Transaction ID", value: detail.id },
        { label: "External ID", value: detail.externalId },
        { label: "Transaction Type", value: detail.transactionType },
        { label: "Status", value: detail.status },
        { label: "Country", value: detail.country },
        { label: "Reversal Status", value: detail.reversalStatus },
      ],
      fullWidthFields: [{ label: "Reason", value: detail.reason }],
    },
    {
      title: "Transaction Details",
      fields: [
        { label: "Amount", value: detail.amount },
        { label: "Total Paid", value: detail.totalPaid },
        { label: "Total Received", value: detail.totalReceived },
        { label: "Total Fee", value: detail.totalFee },
        { label: "Total Voucher Discount", value: detail.totalVoucherDiscount },
        { label: "Yourpoin Loyalty Cashback", value: detail.yourpoinCashback },
      ],
      fullWidthFields: [{ label: "Has Voucher?", value: detail.hasVoucher }],
    },
    {
      title: "Party Information",
      fields: [
        { label: "Sender", value: detail.sender },
        { label: "Receiver", value: detail.receiver },
      ],
      fullWidthFields: [{ label: "Initiator", value: detail.initiator }],
    },
    {
      title: "Reference Numbers",
      fields: [
        { label: "Trade Number", value: detail.tradeNumber },
        { label: "Payment Number", value: detail.paymentNumber },
      ],
      fullWidthFields: [{ label: "Service ID", value: detail.serviceId }],
    },
    {
      title: "Timestamps",
      fields: [
        { label: "Created At", value: formatDisplayDateTime(detail.createdAt) },
        { label: "Updated At", value: formatDisplayDateTime(detail.updatedAt) },
      ],
    },
  ];
}

