import { useSyncGlobalLoading } from '@/shared/lib';
import { useUsersQuery } from '@/entities/user';

export interface UseUserListQueryParams {
  pageIndex: number;
  pageSize: number;
}

/**
 * Page-level query wrapper for the user list page.
 *
 * - Fetches the user list via `entities/user` query hook.
 * - Automatically syncs the initial load (`isLoading`) to the global loading spinner.
 */
export function useUserListQuery({
  pageIndex,
  pageSize,
}: UseUserListQueryParams) {
  const query = useUsersQuery({ pageIndex, pageSize });
  useSyncGlobalLoading(query.isLoading);
  return query;
}

