import type { FC } from "react";

import { DataTable, ErrorBoundary, TABLE_BODY_VIEWPORT_HEIGHT } from "@/shared/ui";
import type { KycSubmission } from "@/entities/kyc-submission";

import type { KycSubmissionTableProps } from "./KycSubmissionTable.type";
import { getKycSubmissionTableColumns } from "./KycSubmissionTableColumns";

const COLUMNS = getKycSubmissionTableColumns();

/**
 * Table widget for the KYC submissions page.
 * Freezes Full Name on the left; freezes Status and Action on the right.
 * Vertical and horizontal scroll shadows are enabled.
 */
export const KycSubmissionTable: FC<KycSubmissionTableProps> = ({
  data,
  total,
  pageIndex,
  pageSize,
  isRefetching,
  onPageChange,
}) => {
  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);

  return (
    <ErrorBoundary>
      <div className="relative flex flex-col">
        <DataTable<KycSubmission>
          columns={COLUMNS}
          data={data}
          getRowId={(row) => row.kycHeaderId ?? row.id ?? ""}
          scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
          enableVerticalShadow
          initialColumnPinning={{
            left: ["fullName"],
            right: ["status", "actions"],
          }}
          isLoading={isRefetching}
          loading={{ loadingVariant: "spinner" }}
          pagination={{ pageIndex, pageSize }}
          pageCount={pageCount}
          onPaginationChange={(pagination) =>
            onPageChange(pagination.pageIndex, pagination.pageSize)
          }
          empty={{ emptyMessage: "No KYC submissions found." }}
          showPagination
          bordered
        />
      </div>
    </ErrorBoundary>
  );
};
