import { useQuery } from "@tanstack/react-query";

import { apiClient, type ApiResponse } from "@/shared/api";
import {
  apiKycListResponseSchema,
  type ApiKycListResponse,
  type KycSubmission,
  type KycSubmissionsResponse,
} from "../model";

/**
 * Query params for GET v1/operators/verification-submissions.
 * Aligned with Laravel GetKYClistService and OperatorsVerificationSubmissionRepository.
 */
export interface KycSubmissionsQueryParams {
  pageIndex: number;
  pageSize: number;
  /** Search keyword (e.g. name, phone). */
  keyword?: string;
  /** Status filter: pending | approved | rejected | all. */
  status?: string;
  /** Country code filter (e.g. ID, SG, HK) or "all". */
  country?: string;
  /** Document type filter or "all". */
  documentType?: string;
  /** KYC submission date range: from (RFC3339 or Y-m-d). */
  createdAtFrom?: string;
  /** KYC submission date range: to (RFC3339 or Y-m-d). */
  createdAtTo?: string;
  /** Last update date range: from. */
  updatedAtFrom?: string;
  /** Last update date range: to. */
  updatedAtTo?: string;
  /** Reverify status: yes | no | all. */
  isReverification?: string;
}

/**
 * Format ISO/RFC3339 date to "MMM d, yyyy" for display.
 */
function formatDateOnly(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

/**
 * Map API response items array to KycSubmission[] and total.
 */
function mapResponse(raw: ApiKycListResponse): KycSubmissionsResponse {
  const page = raw.data;
  const items = (page?.items ?? []) as Array<Record<string, unknown>>;
  const total = page?.total_items ?? 0;

  const data: KycSubmission[] = items.map((item) => {
    const metadata = (item.metadata as { created_at?: string; updated_at?: string } | undefined) ?? {};
    const created = metadata.created_at;
    const updated = metadata.updated_at;
    const statusVal = item.status;
    const status = typeof statusVal === "string" ? statusVal : (statusVal as { value?: string })?.value;
    const idVal = item.id ?? item.kyc_header_id;
    const id = typeof idVal === "string" ? idVal : String(idVal ?? "");

    return {
      id,
      kycHeaderId: (item.kyc_header_id as string) ?? id,
      customerId: item.customer_id as string | undefined,
      fullname: item.fullname as string | undefined,
      countryCode: item.country_code as string | undefined,
      mobile: (item.mobile ?? item.phone_number) as string | undefined,
      phoneNumber: item.phone_number as string | undefined,
      status,
      documentType: item.document_type as string | undefined,
      uploadDate: formatDateOnly(created),
      lastUpdate: formatDateOnly(updated),
      createdAt: created,
      updatedAt: updated,
      verifiedBy: item.verified_by as string | undefined,
      rejectionNote: item.rejection_note as string | undefined,
      arcNumber: item.arc_number as string | undefined,
      arcExpiryDate: item.arc_expiry_date as string | undefined,
      reverifyStatus: (item as { is_reverification?: boolean }).is_reverification ? "Yes" : "No",
    };
  });

  return { data, total };
}

/**
 * TanStack Query hook for the paginated KYC submissions list.
 *
 * Uses GET v1/operators/verification-submissions with query params:
 * page, limit, keyword, status, country, document_type, latest_per_customer,
 * created_at (from/to), updated_at (from/to), is_reverification.
 */
export function useKycSubmissionsQuery({
  pageIndex,
  pageSize,
  keyword,
  status,
  country,
  documentType,
  createdAtFrom,
  createdAtTo,
  updatedAtFrom,
  updatedAtTo,
  isReverification,
}: KycSubmissionsQueryParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(pageIndex + 1));
  searchParams.set("limit", String(pageSize));
  searchParams.set("latest_per_customer", "true");

  if (keyword?.trim()) {
    searchParams.set("keyword", keyword.trim());
  }
  if (status && status !== "all") {
    searchParams.set("status", status);
  }
  if (country && country !== "all") {
    searchParams.set("country", country);
  }
  if (documentType && documentType !== "all") {
    searchParams.set("document_type", documentType);
  }
  if (isReverification && isReverification !== "all") {
    searchParams.set("is_reverification", isReverification.toLowerCase() === "yes" ? "true" : "false");
  }
  if (createdAtFrom) {
    searchParams.set("created_at_from", createdAtFrom);
  }
  if (createdAtTo) {
    searchParams.set("created_at_to", createdAtTo);
  }
  if (updatedAtFrom) {
    searchParams.set("updated_at_from", updatedAtFrom);
  }
  if (updatedAtTo) {
    searchParams.set("updated_at_to", updatedAtTo);
  }

  const path = `v1/operators/verification-submissions?${searchParams.toString()}`;

  return useQuery<ApiResponse<unknown>, Error, KycSubmissionsResponse>({
    queryKey: [
      "operators-verification-submissions",
      pageIndex,
      pageSize,
      keyword,
      status,
      country,
      documentType,
      createdAtFrom,
      createdAtTo,
      updatedAtFrom,
      updatedAtTo,
      isReverification,
    ],
    queryFn: async ({ signal }) => apiClient.get<unknown>(path, { signal }),
    placeholderData: (previousData) => previousData,
    select: (res) => {
      const validated = apiKycListResponseSchema.parse(res.data);
      return mapResponse(validated);
    },
  });
}
