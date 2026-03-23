import { useQuery } from "@tanstack/react-query";

import { getV1OperatorsRejectReasons } from "@/shared/api/generated/clients/operators-verification-submission";
import { mapRejectReasons } from "./reject-reasons-mapper";

export interface RejectReasonOption {
  code: string;
  title: string;
  description: string;
}

/**
 * Query reject reasons for verification status updates.
 * Endpoint: GET /v1/operators/reject-reasons
 */
export function useRejectReasonsQuery(country?: string) {
  const normalizedCountry = String(country ?? "").trim().toUpperCase();

  return useQuery({
    queryKey: ["operators-verification-reject-reasons", normalizedCountry],
    enabled: normalizedCountry.length > 0,
    queryFn: async ({ signal }) =>
      getV1OperatorsRejectReasons({ query: { country: normalizedCountry }, signal }),
    select: (res) => mapRejectReasons(res.data?.data),
  });
}

