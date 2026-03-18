import { useUserDetailQuery } from "@/entities/user";
import { useSyncGlobalLoading } from "@/shared/lib";

interface UseCustomerDetailQueryParams {
  customerId: string;
}

/**
 * Page-level query wrapper for customer detail.
 *
 * @param params - Customer identifier.
 * @returns Customer detail query result with global loading sync.
 */
export function useCustomerDetailQuery({ customerId }: UseCustomerDetailQueryParams) {
  const query = useUserDetailQuery({ customerId });
  useSyncGlobalLoading(query.isLoading);
  return query;
}
