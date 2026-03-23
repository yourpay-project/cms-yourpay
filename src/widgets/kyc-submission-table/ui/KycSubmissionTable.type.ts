import type { KycSubmission } from "@/entities/kyc-submission";

/**
 * Props for the KYC submissions list table.
 */
export interface KycSubmissionTableProps {
  data: KycSubmission[];
  total: number;
  pageIndex: number;
  pageSize: number;
  isRefetching: boolean;
  onPageChange: (pageIndex: number, pageSize: number) => void;
}

