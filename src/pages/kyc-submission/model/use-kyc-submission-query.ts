import { useSyncGlobalLoading } from "@/shared/lib";
import { useKycSubmissionsQuery } from "@/entities/kyc-submission";
import type { KycSubmissionsQueryParams } from "@/entities/kyc-submission";

/**
 * Page-level query wrapper for the KYC submission list page.
 * Fetches list via entities/kyc-submission and syncs initial load to global Nav loader.
 */
export function useKycSubmissionQuery(params: KycSubmissionsQueryParams) {
  const query = useKycSubmissionsQuery(params);
  useSyncGlobalLoading(query.isLoading);
  return query;
}
