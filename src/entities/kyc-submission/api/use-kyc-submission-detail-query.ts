import { useQuery } from "@tanstack/react-query";

import { getV1OperatorsVerificationSubmissionsById } from "@/shared/api/generated";
import type { VerificationSubmissionHeadersResponse } from "@/shared/api/generated";

import {
  apiVerificationSubmissionHeadersResponseSchema,
  mapVerificationSubmissionDetailResponse,
  type KycSubmissionDetail,
} from "../model";

export interface KycSubmissionDetailQueryParams {
  id: string;
}

/**
 * Detail query for `GET /v1/operators/verification-submissions/{id}`.
 *
 * Maps the backend verification submission detail into `KycSubmissionDetail`.
 */
export function useKycSubmissionDetailQuery({ id }: KycSubmissionDetailQueryParams) {
  return useQuery({
    queryKey: ["operators-verification-submission-detail", id],
    enabled: id.trim() !== "",
    queryFn: async ({ signal }) => {
      return getV1OperatorsVerificationSubmissionsById({
        signal,
        pathParams: { id },
      });
    },
    select: (res): KycSubmissionDetail => {
      const validated = apiVerificationSubmissionHeadersResponseSchema.parse(
        res.data as VerificationSubmissionHeadersResponse,
      );
      return mapVerificationSubmissionDetailResponse(validated, id);
    },
  });
}

