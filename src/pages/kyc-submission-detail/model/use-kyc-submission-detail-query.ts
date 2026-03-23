import { useSyncGlobalLoading } from "@/shared/lib";

import {
  useKycSubmissionDetailQuery,
  type KycSubmissionDetailQueryParams,
} from "@/entities/kyc-submission";

export function useKycSubmissionDetailPageQuery(params: KycSubmissionDetailQueryParams) {
  const query = useKycSubmissionDetailQuery(params);
  useSyncGlobalLoading(query.isLoading);
  return query;
}

