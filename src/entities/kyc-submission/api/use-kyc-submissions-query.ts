import { useQuery } from "@tanstack/react-query";
import { getV1OperatorsVerificationSubmissions } from "@/shared/api/generated/clients/operators-verification-submission";
import { parseApiData } from "@/shared/api";
import {
  kycVerificationSubmissionsResponseSchema,
  mapKycSubmissionsResponse,
  type KycSubmissionsQueryParams,
} from "../model";

/**
 * TanStack Query hook for the paginated KYC submissions list.
 *
 * Uses generated client `getV1OperatorsVerificationSubmissions` and validates
 * the payload using Zod before mapping to the entity list response model.
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
  return useQuery({
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
    queryFn: async ({ signal }) =>
      getV1OperatorsVerificationSubmissions({
        signal,
        query: {
          page: pageIndex + 1,
          limit: pageSize,
          latest_per_customer: true,
          keyword: keyword?.trim() || undefined,
          status: status && status !== "all" ? status : undefined,
          country: country && country !== "all" ? country : undefined,
          document_type: documentType && documentType !== "all" ? documentType : undefined,
          is_reverification:
            isReverification && isReverification !== "all"
              ? isReverification.toLowerCase() === "yes"
              : undefined,
          created_at_from: createdAtFrom,
          created_at_to: createdAtTo,
          updated_at_from: updatedAtFrom,
          updated_at_to: updatedAtTo,
        },
      }),
    placeholderData: (previousData) => previousData,
    select: (res) => {
      const validated = parseApiData(
        kycVerificationSubmissionsResponseSchema,
        res
      );
      return mapKycSubmissionsResponse(validated);
    },
  });
}
