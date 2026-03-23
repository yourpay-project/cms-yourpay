import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/api";

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
      apiClient.get<{
        data?: unknown[] | { list?: unknown[] };
      }>(`v1/operators/reject-reasons?country=${encodeURIComponent(normalizedCountry)}`, { signal }),
    select: (res): RejectReasonOption[] => {
      const rawData = res.data?.data;
      const list = Array.isArray(rawData)
        ? rawData
        : Array.isArray((rawData as { list?: unknown[] } | undefined)?.list)
          ? ((rawData as { list?: unknown[] }).list ?? [])
          : [];
      return list
        .filter((item): item is { code?: string; label_title?: string; label_description?: string } => Boolean(item))
        .map((item) => ({
          code: item.code ?? "",
          title: item.label_title ?? item.code ?? "Unknown reason",
          description: item.label_description ?? "",
        }))
        .filter((item) => item.code.trim() !== "");
    },
  });
}

