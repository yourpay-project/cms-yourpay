import type { FC } from "react";
import { useParams } from "@tanstack/react-router";
import { PageSkeleton } from "@/shared/ui";
import { useTransactionDetailQuery } from "..";
import { TransactionDetailHeader } from "./TransactionDetailHeader";
import { TransactionDetailSectionsCard } from "./TransactionDetailSectionsCard";
import {
  buildTransactionDetailSections,
  getTransactionDetailErrorMessage,
  getTransactionStatusVariant,
} from "./transaction-detail-view-model";

/**
 * Route-level page for transaction detail (`/transactions/$id`).
 *
 * @returns Transaction detail page content.
 */
const TransactionDetailPage: FC = () => {
  const { id } = useParams({ from: "/transactions/$id" });
  const query = useTransactionDetailQuery(id);

  if (query.isLoading) return <PageSkeleton />;

  if (query.isError) {
    const message = getTransactionDetailErrorMessage(query.error);
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const detail = query.data;
  if (!detail) return <p className="text-sm text-muted-foreground">Transaction detail is unavailable.</p>;

  const normalizedStatus = String(detail.status ?? "").trim().toUpperCase();
  const statusVariant = getTransactionStatusVariant(detail.status);
  const sections = buildTransactionDetailSections(detail);

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-4">
      <TransactionDetailHeader
        transactionType={detail.transactionType}
        transactionId={detail.id}
        normalizedStatus={normalizedStatus}
        statusVariant={statusVariant}
      />
      <TransactionDetailSectionsCard sections={sections} />
    </div>
  );
};

export default TransactionDetailPage;
