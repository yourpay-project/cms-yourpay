import { useSyncGlobalLoading } from "@/shared/lib";
import { useTransactionDetailQuery as useEntityTransactionDetailQuery } from "@/entities/transaction";

export function useTransactionDetailQuery(id: string) {
  const query = useEntityTransactionDetailQuery({ id });
  useSyncGlobalLoading(query.isLoading);
  return query;
}
