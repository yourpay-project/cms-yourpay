import { useSyncGlobalLoading } from "@/shared/lib";
import { useUsersQuery } from "@/entities/user";

export interface UseUserListQueryParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: string;
  gender?: string;
  country?: string;
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
  status,
  gender,
  country,
}: UseUserListQueryParams) {
  const query = useUsersQuery({
    pageIndex,
    pageSize,
    search,
    status,
    gender,
    country,
  });

  useSyncGlobalLoading(query.isLoading);
  return query;
}

