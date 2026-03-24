import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { mapTransactionsResponse } from "../model";

export interface TransactionsQueryParams {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  /**
   * Query keys and values from SDUI filter metadata (e.g. `country`, `service_code`, `status`, `transaction_date`).
   */
  dynamicFilters?: Record<string, string>;
}

export function useTransactionsQuery(params: TransactionsQueryParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.pageIndex + 1));
  searchParams.set("limit", String(params.pageSize));

  if (params.keyword?.trim()) searchParams.set("keyword", params.keyword.trim());
  if (params.dynamicFilters) {
    for (const [key, value] of Object.entries(params.dynamicFilters)) {
      if (value && value.trim() !== "") {
        searchParams.set(key, value.trim());
      }
    }
  }

  return useQuery({
    queryKey: ["operators-transactions", params],
    queryFn: ({ signal }) =>
      apiClient.get<unknown>(`v1/operators/transactions?${searchParams.toString()}`, { signal }),
    placeholderData: (previousData) => previousData,
    select: (res) => mapTransactionsResponse(res.data),
  });
}
