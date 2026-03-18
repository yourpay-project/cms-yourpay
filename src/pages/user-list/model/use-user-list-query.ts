import { useSyncGlobalLoading } from "@/shared/lib";
import { useUsersQuery } from "@/entities/user";

export interface UseUserListQueryParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, string>;
}

/**
 * Page-level query wrapper for the user list page.
 *
 * - Fetches the customers list via `entities/user` query hook.
 * - Automatically syncs the initial load (`isLoading`) to the global loading spinner.
 */
export function useUserListQuery({
  pageIndex,
  pageSize,
  search,
  filters,
}: UseUserListQueryParams) {
  const query = useUsersQuery({
    pageIndex,
    pageSize,
    search,
    filters,
  });

  useSyncGlobalLoading(query.isLoading);
  return query;
}

