/**
 * Query params for KYC submissions list (`GET v1/operators/verification-submissions`).
 * Consumed by the entities query hook and translated into generated client query params.
 */
export interface KycSubmissionsQueryParams {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  country?: string;
  documentType?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  isReverification?: string;
}
