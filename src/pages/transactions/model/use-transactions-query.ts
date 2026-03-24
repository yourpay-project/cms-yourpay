import { useSyncGlobalLoading } from "@/shared/lib";
import { useTransactionsQuery as useTransactionsEntityQuery } from "@/entities/transaction";
import type { TransactionsQueryParams } from "@/entities/transaction";

export function useTransactionsQuery(params: TransactionsQueryParams) {
  const query = useTransactionsEntityQuery(params);
  useSyncGlobalLoading(query.isLoading);
  return query;
}
