import type { FC } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ApiClientError } from "@/shared/api";
import { Button, Card, CardContent, PageSkeleton } from "@/shared/ui";
import { useTransactionDetailQuery } from "..";

interface DetailFieldProps {
  label: string;
  value: string | undefined;
}

const DetailField: FC<DetailFieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">{value || "-"}</div>
  </div>
);

const TransactionDetailPage: FC = () => {
  const { id } = useParams({ from: "/transactions/$id" });
  const query = useTransactionDetailQuery(id);

  if (query.isLoading) return <PageSkeleton />;

  if (query.isError) {
    const apiError = query.error instanceof ApiClientError ? query.error : null;
    const message = apiError?.status === 404 ? "Transaction detail not found." : "Failed to load transaction detail.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const detail = query.data;
  if (!detail) return <p className="text-sm text-muted-foreground">Transaction detail is unavailable.</p>;

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transaction Details</h2>
        <Button asChild variant="outline" size="sm" type="button">
          <Link to="/transactions" className="inline-flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="space-y-6 p-4">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailField label="Transaction ID" value={detail.id} />
              <DetailField label="External ID" value={detail.externalId} />
              <DetailField label="Transaction Type" value={detail.transactionType} />
              <DetailField label="Status" value={detail.status} />
              <DetailField label="Country" value={detail.country} />
              <DetailField label="Reversal Status" value={detail.reversalStatus} />
            </div>
            <DetailField label="Reason" value={detail.reason} />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Transaction Details</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailField label="Amount" value={detail.amount} />
              <DetailField label="Total Paid" value={detail.totalPaid} />
              <DetailField label="Total Received" value={detail.totalReceived} />
              <DetailField label="Total Fee" value={detail.totalFee} />
              <DetailField label="Total Voucher Discount" value={detail.totalVoucherDiscount} />
              <DetailField label="Yourpoin Loyalty Cashback" value={detail.yourpoinCashback} />
            </div>
            <DetailField label="Has Voucher?" value={detail.hasVoucher} />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Party Information</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailField label="Sender" value={detail.sender} />
              <DetailField label="Receiver" value={detail.receiver} />
            </div>
            <DetailField label="Initiator" value={detail.initiator} />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Reference Numbers</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailField label="Trade Number" value={detail.tradeNumber} />
              <DetailField label="Payment Number" value={detail.paymentNumber} />
            </div>
            <DetailField label="Service ID" value={detail.serviceId} />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Timestamps</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailField label="Created At" value={detail.createdAt} />
              <DetailField label="Updated At" value={detail.updatedAt} />
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetailPage;
