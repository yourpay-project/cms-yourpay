import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { mapTransactionDetail } from "../model";

export interface TransactionDetailQueryParams {
  id: string;
}

export function useTransactionDetailQuery({ id }: TransactionDetailQueryParams) {
  return useQuery({
    queryKey: ["operators-transaction-detail", id],
    enabled: Boolean(id),
    queryFn: ({ signal }) =>
      apiClient.get<unknown>(`v1/operators/transactions/${encodeURIComponent(id)}`, { signal }),
    select: (res) => mapTransactionDetail(res.data),
  });
}
